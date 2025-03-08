FROM golang:1.22-alpine

WORKDIR /app

COPY ./go.mod ./
RUN go mod download

COPY ./api/ ./api/
COPY ./cmd/ ./cmd/

EXPOSE 8080

CMD ["go", "run", "./cmd/main.go"]