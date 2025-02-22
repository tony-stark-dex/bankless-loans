import React from 'react'
import { Box, Heading, Link, Text } from '@chakra-ui/react'
import { AddressZero } from '@ethersproject/constants'
import { Decimal, Percent, LiquityStoreState } from '@liquity/lib-base'
import { useLiquitySelector } from '../hooks/useLiquitySelector'
import { useLiquity } from '../hooks/LiquityContext'
import { Statistic } from './Statistic'

const selectBalances = ({
    accountBalance,
    lusdBalance,
    lqtyBalance,
}: LiquityStoreState) => ({
    accountBalance,
    lusdBalance,
    lqtyBalance,
})

const Balances: React.FC = () => {
    const { accountBalance, lusdBalance, lqtyBalance } =
        useLiquitySelector(selectBalances)

    return (
        <Box sx={{ mb: 3 }}>
            <Heading>My Account Balances</Heading>
            <Statistic name='ETH'> {accountBalance.prettify(4)}</Statistic>
            <Statistic name={'LUSD'}> {lusdBalance.prettify()}</Statistic>
            <Statistic name={'LQTY'}>{lqtyBalance.prettify()}</Statistic>
        </Box>
    )
}

const GitHubCommit: React.FC<{ children?: string }> = ({ children }) =>
    children?.match(/[0-9a-f]{40}/) ? (
        <Link href={`https://github.com/liquity/dev/commit/${children}`}>
            {children.substr(0, 7)}
        </Link>
    ) : (
        <>unknown</>
    )

type SystemStatsProps = {
    variant?: string
    showBalances?: boolean
}

const select = ({
    numberOfTroves,
    price,
    total,
    lusdInStabilityPool,
    borrowingRate,
    redemptionRate,
    totalStakedLQTY,
    frontend,
}: LiquityStoreState) => ({
    numberOfTroves,
    price,
    total,
    lusdInStabilityPool,
    borrowingRate,
    redemptionRate,
    totalStakedLQTY,
    kickbackRate:
        frontend.status === 'registered' ? frontend.kickbackRate : null,
})

export const SystemStats: React.FC<SystemStatsProps> = ({
    variant = 'info',
    showBalances,
}) => {
    const {
        liquity: {
            connection: {
                version: contractsVersion,
                deploymentDate,
                frontendTag,
            },
        },
    } = useLiquity()

    const {
        numberOfTroves,
        price,
        lusdInStabilityPool,
        total,
        borrowingRate,
        totalStakedLQTY,
        kickbackRate,
    } = useLiquitySelector(select)

    const lusdInStabilityPoolPct =
        total.debt.nonZero && new Percent(lusdInStabilityPool.div(total.debt))
    const totalCollateralRatioPct = new Percent(total.collateralRatio(price))
    const borrowingFeePct = new Percent(borrowingRate)
    const kickbackRatePct =
        frontendTag === AddressZero ? '100' : kickbackRate?.mul(100).prettify()

    return (
        <Box
            {...{ variant }}
            sx={{ width: '356px', ml: '10px' }}
            maxW='md'
            borderWidth='3px'
            borderRadius='lg'
            overflow='hidden'
            padding='8px'
        >
            {showBalances && <Balances />}

            <Heading>Liquity statistics</Heading>

            <Heading as='h2' sx={{ mt: 3, fontWeight: 'body' }}>
                Protocol
            </Heading>

            <Statistic
                name='Borrowing Fee'
                tooltip={
                    <Box
                        borderWidth='1px'
                        borderRadius='md'
                        borderColor='#aaa'
                        overflow='hidden'
                        sx={{
                            padding: '10px',
                            bg: '#a7a7e3',
                            fontSize: '0.8em',
                            color: '#333',
                            minW: '12.5vw',
                            height: 'auto',
                            maxW: '33vm',
                            fontStyle: 'italic',
                        }}
                        md={{}}
                        lg={{}}
                    >
                        The Borrowing Fee is a one-off fee charged as a
                        percentage of the borrowed amount (in LUSD) and is part
                        of a Trove&apos;s debt. The fee varies between 0.5% and
                        5% depending on LUSD redemption volumes.
                    </Box>
                }
            >
                {borrowingFeePct.toString(2)}
            </Statistic>
            <Statistic
                name='TVL'
                tooltip={
                    <Box
                        borderWidth='1px'
                        borderRadius='md'
                        borderColor='#aaa'
                        overflow='hidden'
                        sx={{
                            padding: '10px',
                            bg: '#a7a7e3',
                            fontSize: '0.8em',
                            color: '#333',
                            minW: '12.5vw',
                            height: 'auto',
                            maxW: '33vm',
                            fontStyle: 'italic',
                        }}
                        md={{}}
                        lg={{}}
                    >
                        The Total Value Locked (TVL) is the total value of Ether
                        locked as collateral in the system, given in ETH and
                        USD.
                    </Box>
                }
            >
                {total.collateral.shorten()}{' '}
                <Text sx={{ fontSize: 1 }}>&nbsp;ETH</Text>
                <Text sx={{ fontSize: 1 }}>
                    &nbsp;($
                    {Decimal.from(total.collateral.mul(price)).shorten()})
                </Text>
            </Statistic>
            <Statistic
                name='Troves'
                tooltip={
                    <Box
                        borderWidth='1px'
                        borderRadius='md'
                        borderColor='#aaa'
                        overflow='hidden'
                        sx={{
                            padding: '10px',
                            bg: '#a7a7e3',
                            fontSize: '0.8em',
                            color: '#333',
                            minW: '12.5vw',
                            height: 'auto',
                            maxW: '33vm',
                            fontStyle: 'italic',
                        }}
                        md={{}}
                        lg={{}}
                    >
                        The total number of active Troves in the system.
                    </Box>
                }
            >
                {Decimal.from(numberOfTroves).prettify(0)}
            </Statistic>
            <Statistic
                name='LUSD supply'
                tooltip={
                    <Box
                        borderWidth='1px'
                        borderRadius='md'
                        borderColor='#aaa'
                        overflow='hidden'
                        sx={{
                            padding: '10px',
                            bg: '#a7a7e3',
                            fontSize: '0.8em',
                            color: '#333',
                            minW: '12.5vw',
                            height: 'auto',
                            maxW: '33vm',
                            fontStyle: 'italic',
                        }}
                        md={{}}
                        lg={{}}
                    >
                        The total LUSD minted by the Liquity Protocol.
                    </Box>
                }
            >
                {total.debt.shorten()}
            </Statistic>
            {lusdInStabilityPoolPct && (
                <Statistic
                    name='LUSD in Stability Pool'
                    tooltip={
                        <Box
                            borderWidth='1px'
                            borderRadius='md'
                            borderColor='#aaa'
                            overflow='hidden'
                            sx={{
                                padding: '10px',
                                bg: '#a7a7e3',
                                fontSize: '0.8em',
                                color: '#333',
                                minW: '12.5vw',
                                height: 'auto',
                                maxW: '33vm',
                                fontStyle: 'italic',
                            }}
                            md={{}}
                            lg={{}}
                        >
                            The total LUSD currently held in the Stability Pool,
                            expressed as an amount and a fraction of the LUSD
                            supply.
                        </Box>
                    }
                >
                    {lusdInStabilityPool.shorten()}
                    <Text sx={{ fontSize: 1 }}>
                        &nbsp;({lusdInStabilityPoolPct.toString(1)})
                    </Text>
                </Statistic>
            )}
            <Statistic
                name='Staked LQTY'
                tooltip={
                    <Box
                        borderWidth='1px'
                        borderRadius='md'
                        borderColor='#aaa'
                        overflow='hidden'
                        sx={{
                            padding: '10px',
                            bg: '#a7a7e3',
                            fontSize: '0.8em',
                            color: '#333',
                            minW: '12.5vw',
                            height: 'auto',
                            maxW: '33vm',
                            fontStyle: 'italic',
                        }}
                        md={{}}
                        lg={{}}
                    >
                        The total amount of LQTY that is staked for earning fee
                        revenue.
                    </Box>
                }
            >
                {totalStakedLQTY.shorten()}
            </Statistic>
            <Statistic
                name='Total Collateral Ratio'
                tooltip={
                    <Box
                        borderWidth='1px'
                        borderRadius='md'
                        borderColor='#aaa'
                        overflow='hidden'
                        sx={{
                            padding: '10px',
                            bg: '#a7a7e3',
                            fontSize: '0.8em',
                            color: '#333',
                            minW: '12.5vw',
                            height: 'auto',
                            maxW: '33vm',
                            fontStyle: 'italic',
                        }}
                        md={{}}
                        lg={{}}
                    >
                        The ratio of the Dollar value of the entire system
                        collateral at the current ETH:USD price, to the entire
                        system debt.
                    </Box>
                }
            >
                {totalCollateralRatioPct.prettify()}
            </Statistic>
            <Statistic
                name='Recovery Mode'
                tooltip={
                    <Box
                        borderWidth='1px'
                        borderRadius='md'
                        borderColor='#aaa'
                        overflow='hidden'
                        sx={{
                            padding: '10px',
                            bg: '#a7a7e3',
                            fontSize: '0.8em',
                            color: '#333',
                            minW: '12.5vw',
                            height: 'auto',
                            maxW: '33vm',
                            fontStyle: 'italic',
                        }}
                        md={{}}
                        lg={{}}
                    >
                        Recovery Mode is activated when the Total Collateral
                        Ratio (TCR) falls below 150%. When active, your Trove
                        can be liquidated if its collateral ratio is below the
                        TCR. The maximum collateral you can lose from
                        liquidation is capped at 110% of your Trove&#39;s debt.
                        Operations are also restricted that would negatively
                        impact the TCR.
                    </Box>
                }
            >
                {total.collateralRatioIsBelowCritical(price) ? (
                    <Box color='danger'>Yes</Box>
                ) : (
                    'No'
                )}
            </Statistic>
            {}

            {/* <Heading as='h2' sx={{ mt: 3, fontWeight: 'body' }}>
                Frontend
            </Heading>
            {kickbackRatePct && (
                <Statistic
                    name='Kickback Rate'
                    tooltip='A rate between 0 and 100% set by the Frontend Operator that determines the fraction of LQTY that will be paid out as a kickback to the Stability Providers using the frontend.'
                >
                    {kickbackRatePct}%
                </Statistic>
            )}

            <Box sx={{ mt: 3, opacity: 0.66 }}>
                <Box sx={{ fontSize: 0 }}>
                    Contracts version:{' '}
                    <GitHubCommit>{contractsVersion}</GitHubCommit>
                </Box>
                <Box sx={{ fontSize: 0 }}>
                    Deployed: {deploymentDate.toLocaleString()}
                </Box>
                <Box sx={{ fontSize: 0 }}>
                    Frontend version:{' '}
                    {process.env.NODE_ENV === 'development' ? (
                        'development'
                    ) : (
                        <GitHubCommit>
                            {process.env.REACT_APP_VERSION}
                        </GitHubCommit>
                    )}
                </Box>
            </Box> */}
        </Box>
    )
}
