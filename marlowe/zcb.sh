#! /bin/bash

# tx template

marlowe-cli template zcb \
	--minimum-ada ' + minAda + ' \
	--lender ' + lenderAddr + ' \
	--borrower ' + borrowerAddr + ' \
	--principle ' + principle + ' \
	--interest ' + interest + ' \
	--lending-deadline ' + lenderDeadline + ' \
	--repayment-deadline ' + borrowerDeadline + ' \
	--outcontract-file ' + zcbContract + ' \
	--out-state-file ' + zcbState

marlowe-cli run initialize \
  --permanently-without-staking \
  --contract-file ' + zcbContract + ' \
  --state-file ' + zcbState + ' \
  --out-file ' + marlowe1

marlowe-cli run auto-execute \
  --marlowe-out-file ' + marlowe1 + ' \
  --change-address ' + lenderAddr + ' \
  --required-signer ' + lenderKey + ' \
  --out-file ' + tx1Signed + ' \
  --submit=600s

marlowe-cli run prepare \
	--deposit-account ' + lenderAddr + ' \
	--deposit-party ' + lenderAddr + ' \
	--deposit-amount ' + principle + ' \
	--invalid-before ' + (Date.now() - 1) + ' \
	--invalid-hereafter ' + (Date.now() + (5*60*1000)) + ' \
	--marlowe-file ' + marlowe1 + ' \
	--out-file ' + marlowe2

marlowe-cli run auto-execute \
  --tx-in-marlowe ' + utxo + ' \
  --marlowe-in-file ' + marlowe1 + ' \
  --marlowe-out-file ' + marlowe2 + ' \
  --change-address ' + lenderAddr + ' \
  --required-signer ' + lenderKey + ' \
  --out-file ' + tx2Signed + ' \
  --submit=600s

marlowe-cli run prepare \
  --deposit-account ' + borrowerAddr + ' \
  --deposit-party ' + borrowerAddr + ' \
  --deposit-amount ' + (principle + interest) + ' \
  --invalid-before ' + (Date.now() - 1) + ' \
  --invalid-hereafter ' + (Date.now() + (5*60*1000)) + ' \
  --marlowe-file ' + marlowe2 + ' \
  --out-file ' + marlowe3

marlowe-cli run auto-execute \
  --tx-in-marlowe ' + utxo + ' \
  --marlowe-in-file ' + marlowe2 + ' \
  --marlowe-out-file ' + marlowe3 + ' \
  --change-address ' + borrowerAddr + ' \
  --required-signer ' + borrowerKey + ' \
  --out-file ' + tx3Signed + ' \
  --submit=600s

---

# V This works V

# lenderAddress addr_test1vp92s5fqfwl60g7uz270y85fg059e6tn08wqmzh4y9pvjwse7gtkr
# lender skey 64414ab181f56550778f7880.skey

# borrower address addr_test1vqz79y6etkwjf02lczgm4djeh2tr7eu86v0557l6fyyda9cfr9359
# borrowe skey 64414ae381f56550778f7882.skey

marlowe-cli template zcb \
	--minimum-ada 2000000 \
	--lender addr_test1vp92s5fqfwl60g7uz270y85fg059e6tn08wqmzh4y9pvjwse7gtkr \
	--borrower addr_test1vqz79y6etkwjf02lczgm4djeh2tr7eu86v0557l6fyyda9cfr9359 \
	--principal 100000000 \
	--interest 5000000 \
	--lending-deadline "$(($(date -u +%s) * 1000 + 60 * 60000))" \
	--repayment-deadline "$(($(date -u +%s) * 1000 + 120 * 60000))" \
	--out-contract-file zcb-contract.json \
	--out-state-file zcb-state.json

marlowe-cli run initialize \
  --permanently-without-staking \
  --testnet-magic 2 \
  --contract-file zcb-contract.json \
  --state-file zcb-state.json \
  --out-file marlowe-1.json

marlowe-cli run auto-execute \
  --marlowe-out-file marlowe-1.json \
  --change-address addr_test1vp92s5fqfwl60g7uz270y85fg059e6tn08wqmzh4y9pvjwse7gtkr \
  --required-signer 64414ab181f56550778f7880.skey \
  --testnet-magic 2 \
  --out-file tx1.signed \
  --submit=600s

marlowe-cli run prepare \
	--deposit-account addr_test1vp92s5fqfwl60g7uz270y85fg059e6tn08wqmzh4y9pvjwse7gtkr \
	--deposit-party addr_test1vp92s5fqfwl60g7uz270y85fg059e6tn08wqmzh4y9pvjwse7gtkr \
	--deposit-amount 100000000 \
	--invalid-before "$(($(date -u +%s) * 1000 - 1 * 60000))" \
	--invalid-hereafter "$(($(date -u +%s) * 1000 + 10 * 60000))" \
	--marlowe-file marlowe-1.json \
	--out-file marlowe-2.json

marlowe-cli run auto-execute \
  --testnet-magic 2 \
  --tx-in-marlowe 531d6aa66591c6e53fee5bf1d4588ad3a222517ea1f4ca947d608c4c769237ba#1 \
  --marlowe-in-file marlowe-1.json \
  --marlowe-out-file marlowe-2.json \
  --change-address addr_test1vp92s5fqfwl60g7uz270y85fg059e6tn08wqmzh4y9pvjwse7gtkr \
  --required-signer 64414ab181f56550778f7880.skey \
  --out-file tx2.signed \
  --submit=600s

marlowe-cli run prepare \
  --deposit-account addr_test1vqz79y6etkwjf02lczgm4djeh2tr7eu86v0557l6fyyda9cfr9359 \
  --deposit-party addr_test1vqz79y6etkwjf02lczgm4djeh2tr7eu86v0557l6fyyda9cfr9359 \
  --deposit-amount 105000000 \
  --invalid-before "$(($(date -u +%s) * 1000 - 1 * 60000))" \
  --invalid-hereafter "$(($(date -u +%s) * 1000 + 10 * 60000))" \
  --marlowe-file marlowe-2.json \
  --out-file marlowe-3.json

marlowe-cli run auto-execute \
  --testnet-magic 2 \
  --tx-in-marlowe 247cd1a9fd8dbb8dce839eb861142e08d6fa618a6f60ee5a565d8466313001d8#1 \
  --marlowe-in-file marlowe-2.json \
  --marlowe-out-file marlowe-3.json \
  --change-address addr_test1vqz79y6etkwjf02lczgm4djeh2tr7eu86v0557l6fyyda9cfr9359 \
  --required-signer 64414ae381f56550778f7882.skey \
  --out-file tx3.signed \
  --submit=600s