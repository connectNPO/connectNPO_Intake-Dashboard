#!/usr/bin/env bash
set -euo pipefail

TARGET_FILE="/root/.connectnpo-reviewer.env"
LOGIN_URL_DEFAULT="https://connectnpo-web-6we2.vercel.app/login"

echo "connectNPO reviewer credential setup"
echo "This writes credentials to ${TARGET_FILE} with chmod 600."
echo "Do NOT paste these credentials into Discord or commit them to git."
echo

read -r -p "Reviewer email: " REVIEWER_EMAIL
read -r -s -p "Reviewer password: " REVIEWER_PASSWORD
echo
read -r -p "Login URL [${LOGIN_URL_DEFAULT}]: " LOGIN_URL
LOGIN_URL="${LOGIN_URL:-$LOGIN_URL_DEFAULT}"

if [[ -z "${REVIEWER_EMAIL}" || -z "${REVIEWER_PASSWORD}" || -z "${LOGIN_URL}" ]]; then
  echo "Error: email, password, and login URL are required." >&2
  exit 1
fi

umask 077
cat > "${TARGET_FILE}" <<EOF
CONNECTNPO_REVIEWER_EMAIL=${REVIEWER_EMAIL}
CONNECTNPO_REVIEWER_PASSWORD=${REVIEWER_PASSWORD}
CONNECTNPO_LOGIN_URL=${LOGIN_URL}
EOF
chmod 600 "${TARGET_FILE}"

echo
echo "Saved ${TARGET_FILE}"
echo "Permissions: $(stat -c '%a %U:%G' "${TARGET_FILE}")"
echo "Done."
