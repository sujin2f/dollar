// yarn test src/client/utils/item.spec.ts

import { getRawItemMeta, rawTextToRawItem } from './item'

describe('item.ts', () => {
    describe('getRawItemMeta()', () => {
        it('Tab, ', () => {
            const testData = `Transaction Date	Code	Description	Debit	Credit	Balance
Balance Forward			$36,540.97
Mar 7, 2022	PR	SHERBOURNE VARI	$32.30		$36,508.67`
            const result = getRawItemMeta(testData)
            expect(result).toEqual({
                separate: '\t',
                columns: {
                    date: [0, 'Transaction Date'],
                    code: [1, 'Code'],
                    title: [2, 'Description'],
                    debit: [3, 'Debit'],
                    credit: [4, 'Credit'],
                    balance: [5, 'Balance'],
                },
                dateFormat: '',
            })
        })

        it('Comma, ', () => {
            const testData = `Transaction Date, Code, Description, Debit, Credit, Balance
Balance Forward, , , $36,540.97
Mar 7, 2022, PR, SHERBOURNE VARI, $32.30, , $36,508.67`
            const result = getRawItemMeta(testData)
            expect(result).toEqual({
                separate: ',',
                columns: {
                    date: [0, 'Transaction Date'],
                    code: [1, 'Code'],
                    title: [2, 'Description'],
                    debit: [3, 'Debit'],
                    credit: [4, 'Credit'],
                    balance: [5, 'Balance'],
                },
                dateFormat: '',
            })
        })

        it('Date Format, ', () => {
            const testData = `Transaction Date	Posting Date	Description	Amount
10/03/2022	14/03/2022	P.A.T. CENTRAL MARKET TORONTO ON	$62.20`
            const result = getRawItemMeta(testData)
            expect(result).toEqual({
                separate: '\t',
                columns: {
                    date: [0, 'Transaction Date'],
                    title: [2, 'Description'],
                    debit: [3, 'Amount'],
                },
                dateFormat: 'DD/MM/YYYY',
            })
        })

        it('Empty, ', () => {
            const result = getRawItemMeta('')
            expect(result).toEqual({
                separate: '\t',
                columns: {},
                dateFormat: '',
            })
        })
    })

    describe('getRawItemMeta()', () => {
        it('Tab, ', () => {
            const testData = `Transaction Date	Code	Description	Debit	Credit	Balance
Balance Forward			$36,540.97
Mar 7, 2022	PR	SHERBOURNE VARI	$32.30		$36,508.67
Mar 9, 2022	PR	SHERBOURNE VARI	$16.15		$36,492.52
Mar 14, 2022	PR	SHERBOURNE VARI	$32.30		$36,460.22
Mar 16, 2022	CW	CARMA CORP	$43.63		$36,416.59
Mar 18, 2022	DN	PAY/PAY			$38,549.36`
            const result = rawTextToRawItem(testData, getRawItemMeta(testData))
            expect(result.length).toEqual(4)
            expect(result[0].debit).toEqual(32.3)
            expect(result[1].debit).toEqual(16.15)
            expect(result[2].debit).toEqual(32.3)
            expect(result[3].debit).toEqual(43.63)
        })

        it('Date Format, ', () => {
            const testData = `Transaction Date	Code	Description	Debit	Credit	Balance
Balance Forward			$36,540.97
10/03/2022	PR	SHERBOURNE VARI	$32.30		$36,508.67
10/03	PR	SHERBOURNE VARI	$16.15		$36,492.52
10/03/2022	PR	SHERBOURNE VARI	$32.30		$36,460.22
10/03/2022	CW	CARMA CORP	$43.63		$36,416.59
10/03/2022	DN	PAY/PAY		$2,132.77	$38,549.36`
            const result = rawTextToRawItem(testData, getRawItemMeta(testData))
            expect(result.length).toEqual(4)
            expect(result[0].debit).toEqual(32.3)
            expect(result[1].debit).toEqual(32.3)
            expect(result[2].debit).toEqual(43.63)
            expect(result[3].credit).toEqual(2132.77)
        })
    })
})
