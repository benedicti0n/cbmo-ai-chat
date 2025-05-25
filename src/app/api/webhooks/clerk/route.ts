// app/api/webhook/route.ts

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: SIGNING_SECRET is not defined in environment variables')
  }

  const wh = new Webhook(SIGNING_SECRET)

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification failed', {
      status: 400,
    })
  }

  const userId = evt.data.id
  const eventType = evt.type

  try {
    if (eventType === 'user.created') {
      await prisma.user.create({
        data: {
          clerkId: userId!,
          email: evt.data.email_addresses[0].email_address,
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
        },
      })
    } else if (eventType === 'user.deleted') {
      // First fetch the user and related data
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: {
          conversations: true,
        },
      })

      if (!user) {
        return new Response('User not found', {
          status: 404,
        })
      }

      // Delete all conversations
      await prisma.conversation.deleteMany({
        where: {
          clerkId: userId,
        },
      })

      // Finally delete the user
      await prisma.user.delete({
        where: {
          clerkId: userId,
        },
      })
    }
  } catch (error) {
    console.error('Database operation failed:', error)
    return new Response('Database operation failed', {
      status: 500,
    })
  }

  return new Response('Webhook processed successfully', { status: 200 })
}
