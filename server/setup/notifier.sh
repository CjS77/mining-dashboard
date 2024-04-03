#!/bin/bash
# example notify script

# 1.
# For transaction received, mined(unconfirmed), and mined events:
#  $1 = "received", "confirmation", or "mined"
#  $2 = amount,
#  $3 = tx_id
#  $4 = message
#  $5 = source address public key
#  $6 = destination address public key
#  $7 = status
#  $8 = excess,
#  $9 = public_nonce,
# $10 = signature,
# $11 = number of confirmations (if applicable, otherwise empty string)
# $12 = direction

# 2.
# For transaction "sent" event, we only have the pending outbound transaction:
# $1 = "sent"
# $2 = amount,
# $3 = tx_id
# $4 = message
# $5 = destination address public key
# $6 = status,
# $7 = direction,

# 3.
# For a transaction "cancelled" event, if it was still pending - it would have the same args as 2. (with $5 as source address public key if inbound).
# If the cancelled tx was already out of pending state, the cancelled event will have the same args as 1.

# append the arguments to a log file
#echo "$@" >> notify.log

# post to a webhook url
webhook_url=http://localhost:3000/wallet-events

post_large() {
  body="{
    \"eventType\": \"$1\",
    \"amount\": \"$2\",
    \"txid\": \"$3\",
    \"message\": \"$4\",
    \"source\": \"$5\",
    \"destination\": \"$6\",
    \"status\": \"$7\",
    \"excess\": \"$8\",
    \"public_nonce\": \"$9\",
    \"signature\": \"${10}\",
    \"confirmations\": ${11},
    \"direction\": \"${12}\"
  }"
  echo "$body"
  curl -i -X POST -H 'Content-Type: application/json' -d "${body}" $webhook_url
}

post_small() {
  body="{
          \"eventType\": \"$1\",
          \"amount\": \"$2\",
          \"txid\": \"$3\",
          \"message\": \"$4\",
          \"destination\": \"$5\",
          \"status\": \"$6\",
          \"direction\": \"$7\"
        }"
        echo $body
        curl -i -X POST -H 'Content-Type: application/json' -d "${body}" $webhook_url
}

if [ -z "${12}" ]; then
  post_small "$@"
else
  post_large "$@"
fi

