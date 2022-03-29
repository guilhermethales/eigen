## Undeployed Changes

### v7.3.3

- Status: **Beta**
- Changelog:

  - User facing changes:

    - New Artwork recommendations home screen rail - ole
    - The changes apply to all users.
    - Add @optionalField directive to My Collection artwork comparable works query - ole
    - artwork dimensions not updated after editing them - mounir
    - Make My Collection Artwork screen images dimensions smaller - mounir
    - Fix Newly added MyCollection Artwork's artist not showing in Filters - kizito
    - Fix Show Only Submitted Artwork Filter Bug - kizito
    - price histogram on artist artwork price filter - gkartalis
    - Initialize images when submitting My Collection artworks - ole
    - Improved search pills - dimatretyak
    - Rename modal title - patrinoua
    - Hide Insights tab in the Artwork page when Market insights, Auctions Results and Comparable Works are not available - daria
    - Restrict showing request price estimate banner for D-Index less than nine - kizito
    - Set import source when creating My Collection artworks - ole
    - Request for price estimate CTA functionality - kizito
    - removed scrollview from price filter - gkartalis
    - Initialize submission form fields from My Collection - ole
    - Fixed unclickable link on the select artwork page in my collection -daria
    - Disable edit option for artwork in my collection coming from SWA - sam
    - Show explanatory banner when successfully uploading an Artwork to MyCollection with SWA flow. The banner is displaued once per session and can be closed -daria
    - Mitigation for deeplinks breaking for some users - brian
    - Populate submission form when submitting an artwork from My Collection - ole

  - Dev changes:
    - bump @testing-library/react-native version - gkartalis
    - Remove old recommendations from home feed - ole
    - set my collection ffs to readyForRelease to true - mounir
    - Hide comparable works behind feature flag - mounir
    - Remove SplitIO QueryPrefetching experiment - ole
    - Added correct events to the SWA banner on MC Artwork page -daria
    - react 17 jsx transform - pavlos
    - Increase app version to 7.3.3
    - Fix submission location input nested scroll view issue - ole
    - replace placeholder and put PhotoRow into palette
    - fix virtualization issues inside my collection screens - mounir
    - remove "rimraf storybook" from setup env
    - Fix scrollable tab red screen issue - brian
    - relay tooling - pavlos
    - RN 0.66 - pavlos
    - Put price estimate range behind feature flag - ole
    - refactor my collection tests - mounir
    - added tests -daria

<!-- DO NOT CHANGE -->

## Released Changes
