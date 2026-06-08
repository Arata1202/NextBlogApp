FROM golang:1.26.3-alpine

WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY ./go.mod ./go.sum ./
RUN go mod download

COPY ./.air.toml ./
COPY ./api/ ./api/
COPY ./cmd/ ./cmd/

EXPOSE 8000

CMD ["air", "-c", ".air.toml"]
