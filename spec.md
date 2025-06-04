# Poker Outs Percentages PWA

The goal of this is to build a PWA using vanilla javascript, html, css3 with bem conventions that helps calculate the % of making your hand based on the amount of players on the table and your out count. The basic formula table is:

Complete Odds Table with Results (1-10 Outs)

# Complete Poker Odds Table - Outs Probability by Player Count

## Precise Formulas and Percentages for 1-10 Outs

| Players | Cards After Flop | % Before Turn Formula | 1-10 Outs Results (Before Turn) | Cards After Turn | % Before River Formula | 1-10 Outs Results (Before River) |
|---------|------------------|----------------------|----------------------------------|------------------|----------------------|-----------------------------------|
| 2 | 45 | `1 - ((45-outs)/45) × ((44-outs)/44)` | 4.4%, 8.8%, 13.0%, 17.2%, 21.2%, 25.2%, 29.0%, 32.7%, 36.4%, 39.9% | 44 | `outs/44` | 2.3%, 4.5%, 6.8%, 9.1%, 11.4%, 13.6%, 15.9%, 18.2%, 20.5%, 22.7% |
| 3 | 43 | `1 - ((43-outs)/43) × ((42-outs)/42)` | 4.7%, 9.2%, 13.6%, 17.9%, 22.1%, 26.2%, 30.2%, 34.1%, 37.9%, 41.5% | 42 | `outs/42` | 2.4%, 4.8%, 7.1%, 9.5%, 11.9%, 14.3%, 16.7%, 19.0%, 21.4%, 23.8% |
| 4 | 41 | `1 - ((41-outs)/41) × ((40-outs)/40)` | 4.9%, 9.8%, 14.6%, 19.3%, 23.8%, 28.2%, 32.4%, 36.6%, 40.6%, 44.4% | 40 | `outs/40` | 2.5%, 5.0%, 7.5%, 10.0%, 12.5%, 15.0%, 17.5%, 20.0%, 22.5%, 25.0% |
| 5 | 39 | `1 - ((39-outs)/39) × ((38-outs)/38)` | 5.1%, 10.3%, 15.3%, 20.1%, 24.7%, 29.1%, 33.4%, 37.5%, 41.4%, 45.1% | 38 | `outs/38` | 2.6%, 5.3%, 7.9%, 10.5%, 13.2%, 15.8%, 18.4%, 21.1%, 23.7%, 26.3% |
| 6 | 37 | `1 - ((37-outs)/37) × ((36-outs)/36)` | 5.4%, 10.8%, 16.0%, 21.0%, 25.8%, 30.4%, 34.8%, 39.0%, 43.0%, 46.8% | 36 | `outs/36` | 2.8%, 5.6%, 8.3%, 11.1%, 13.9%, 16.7%, 19.4%, 22.2%, 25.0%, 27.8% |
| 7 | 35 | `1 - ((35-outs)/35) × ((34-outs)/34)` | 5.7%, 11.3%, 16.6%, 21.8%, 26.9%, 31.8%, 36.5%, 41.0%, 45.3%, 49.4% | 34 | `outs/34` | 2.9%, 5.9%, 8.8%, 11.8%, 14.7%, 17.6%, 20.6%, 23.5%, 26.5%, 29.4% |
| 8 | 33 | `1 - ((33-outs)/33) × ((32-outs)/32)` | 6.1%, 11.9%, 17.6%, 23.1%, 28.4%, 33.5%, 38.4%, 43.0%, 47.4%, 51.6% | 32 | `outs/32` | 3.1%, 6.3%, 9.4%, 12.5%, 15.6%, 18.8%, 21.9%, 25.0%, 28.1%, 31.3% |
| 9 | 31 | `1 - ((31-outs)/31) × ((30-outs)/30)` | 6.5%, 12.6%, 18.4%, 24.0%, 29.3%, 34.4%, 39.2%, 43.8%, 48.1%, 52.2% | 30 | `outs/30` | 3.3%, 6.7%, 10.0%, 13.3%, 16.7%, 20.0%, 23.3%, 26.7%, 30.0%, 33.3% |

## Key Insights

### Common Drawing Hands
- **Flush Draw (9 outs)**: 36.4% heads-up vs 48.1% at full table
- **Open-Ended Straight (8 outs)**: 32.7% heads-up vs 43.8% at full table  
- **Gutshot Straight (4 outs)**: 17.2% heads-up vs 24.0% at full table
- **Two Pair to Full House (4 outs)**: 17.2% heads-up vs 24.0% at full table

*% Before Turn = After seeing flop, odds of hitting by river (2 cards to come)*
*% Before River = After seeing turn, odds of hitting on river (1 card to come)*

It's a single page application that asks you to choose the amount of players from a dropdown and then insert your out count and it will give you the % for the turn and river.

The % should be calculated after the out count input is changed.

This should be a PWA friendly app.

Use a simple user interface based on shadcn/ui but without using tailwind, just using the end CSS that would be generated for the components you need. Use BEM style and CSS3.
