FROM golang:1.27.1-alpine

WORKDIR /app

ARG AIR_VERSION=v1.65.1
RUN go install github.com/air-verse/air@${AIR_VERSION}

RUN adduser -D -u 1000 dev && chown -R dev:dev /go /app
USER dev

COPY ./go.mod ./go.sum ./
RUN go mod download

COPY ./.air.toml ./
COPY ./api/ ./api/
COPY ./cmd/ ./cmd/
COPY ./pkg/ ./pkg/

EXPOSE 8000

CMD ["air", "-c", ".air.toml"]
