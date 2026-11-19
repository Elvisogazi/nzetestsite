/* ==========================================================================
   config.js – site settings you are likely to change
   --------------------------------------------------------------------------
   TALLY FORM SETUP
   1. Create your form at https://tally.so
   2. Add the fields (name, email, phone, consent) plus two HIDDEN fields
      named exactly:  product   and   product_id
   3. Click Share > Embed and copy the form ID from the URL.
      Example: https://tally.so/r/mYf0rM  ->  the ID is "mYf0rM"
   4. Paste the ID below.

   Until you replace the placeholder, the site shows a built-in DEMO form
   that does NOT save any data (it only lets you test the flow).
   ========================================================================== */

const SITE_CONFIG = {
  tallyFormId: "YOUR_TALLY_FORM_ID",

  // How long (ms) to show the "thanks" message before moving to the buy page
  redirectDelayMs: 1500
};
