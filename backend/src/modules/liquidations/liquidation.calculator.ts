import { SettlementPayoutEntity } from '../../entities/settlement-payout.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { AdvanceLoanEntity } from '../../entities/advance-loan.entity'

export function computePartnerPayouts(params: {
  liqId: string
  roundId: string
  isProfit: boolean
  profitPerShare: number
  roundInvs: ShareInvestmentEntity[]
  partners: PartnerEntity[]
  openAdvances: AdvanceLoanEntity[]
}): SettlementPayoutEntity[] {
  const { liqId, roundId, isProfit, profitPerShare, roundInvs, partners, openAdvances } = params
  const payouts: SettlementPayoutEntity[] = []

  for (const partner of partners) {
    const pInvs = roundInvs.filter((i) => i.partnerId === partner.id)
    const shares = pInvs.reduce((sum, i) => sum + i.shareCount, 0)
    if (shares === 0) continue

    const capInvested = pInvs.reduce((sum, i) => sum + Number(i.totalAmount), 0)
    const profit = isProfit ? shares * profitPerShare : 0
    const capReturned = isProfit ? capInvested : Math.max(0, capInvested + shares * profitPerShare)
    const gross = capReturned + profit
    const pAdvs = openAdvances.filter((a) => a.partnerId === partner.id)
    const totAdv = pAdvs.reduce((sum, a) => sum + (Number(a.amount) - Number(a.settledAmount)), 0)

    partner.activeSharesCount = Math.max(0, partner.activeSharesCount - shares)
    partner.outstandingLoans = Math.max(0, Number(partner.outstandingLoans) - totAdv)

    const payout = new SettlementPayoutEntity()
    payout.id = `settle-${Date.now()}-${partner.id}`
    payout.liquidationId = liqId
    payout.roundId = roundId
    payout.partnerId = partner.id
    payout.sharesCount = shares
    payout.capitalReturned = capReturned
    payout.profitShare = profit
    payout.grossEntitlement = gross
    payout.deductedAdvances = totAdv
    payout.netPayable = gross - totAdv
    payout.paid = false
    payouts.push(payout)
  }

  return payouts
}
