FROM public.ecr.aws/lambda/nodejs:16

COPY index.js package.json package-lock.json /var/task/
COPY prisma/ /var/task/prisma/

RUN npm install

RUN npx prisma generate

CMD ["index.handler"]
