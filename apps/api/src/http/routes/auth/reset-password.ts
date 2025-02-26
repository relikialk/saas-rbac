import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { hash } from 'bcryptjs'

export async function resetPassword(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/password/reset',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Get authenticated user profile',
          body: z.object({
            code: z.string(),
            password: z.string().min(8)
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { code, password } = request.body

        const tokenFromCode = await prisma.token.findUnique({
          where: { id: code },
        })

        if (!tokenFromCode) {
          throw new UnauthorizedError()
        }

        const passwordHash = await hash(password, 8)

        await prisma.$transaction([
          prisma.user.update({
            where: {
              id: tokenFromCode.userId
            },
            data: {
              passwordHash
            }
          }),
          prisma.token.delete({
            where: {
              id: code
            }
          })
        ])

        

        return reply.status(204).send()
      }
    )
}
