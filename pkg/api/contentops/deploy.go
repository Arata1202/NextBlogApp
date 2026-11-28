package contentops

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"
)

// DeployZennFeed retries a previously unacknowledged build for this feed revision.
func DeployZennFeed(ctx context.Context, revision string, now time.Time, trigger func() error) error {
	config, credentials, err := loadS3BackupConfigFromEnv()
	if err != nil {
		return err
	}
	key := "deployments/zenn/" + revision + ".json"
	err = putS3ObjectIfAbsent(ctx, config, credentials, key, []byte(`{"status":"pending"}`), s3JSONContentType, now)
	if errors.Is(err, errS3ObjectAlreadyExists) {
		body, _, exists, readErr := getS3Object(ctx, config, credentials, key, now)
		if readErr != nil {
			return readErr
		}
		if !exists {
			return fmt.Errorf("missing Zenn deployment marker %s", key)
		}
		var state struct {
			Status string `json:"status"`
		}
		if err := json.Unmarshal(body, &state); err != nil {
			return err
		}
		switch state.Status {
		case "deployed":
			return nil
		case "pending":
		default:
			return errors.New("invalid Zenn deployment marker")
		}
	} else if err != nil {
		return err
	}
	if err := trigger(); err != nil {
		return err
	}
	_, err = putS3Object(ctx, config, credentials, key, []byte(`{"status":"deployed"}`), s3JSONContentType, nil, now)
	return err
}
