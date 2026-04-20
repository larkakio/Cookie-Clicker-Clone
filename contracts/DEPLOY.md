# Deploy CheckIn (Base mainnet)

1. Install Foundry and set `BASE_RPC_URL` to a Base mainnet HTTPS endpoint.
2. From this directory:

```bash
forge create src/CheckIn.sol:CheckIn \
  --rpc-url "$BASE_RPC_URL" \
  --private-key "$DEPLOYER_PRIVATE_KEY"
```

3. Copy the deployed address into Vercel / `.env` as `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS`.
4. Verify on Basescan (optional):

```bash
forge verify-contract <ADDRESS> src/CheckIn.sol:CheckIn --chain base --watch
```

There is no constructor; the contract is stateless aside from per-user storage.
