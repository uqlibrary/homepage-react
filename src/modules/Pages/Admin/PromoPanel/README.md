# In case of front page error
(e.g. homepage front page continues to show Error Panel, or it's required to show the fall back panel for emergencies (like uncontrolled errors, etc))

Located in /src/modules/Index/components/index.js is the following code:

```javascript
    <Grid item xs={12} md={4}>
          <PromoPanel useAPI promoPanelLoading={promoPanelLoading} account={account} accountLoading={accountLoading} promoPanelActionError={promoPanelActionError} currentPromoPanel={currentPromoPanel} />
    </Grid>
```

The ADDITION of the useAPI prop will cause the promopanel to attempt to read API response (stored in currentPromoPanel state), and reflect any errors through promoPanelActionError.

The REMOVAL of the useAPI this prop will force the promopanel widget to ALWAYS show the fallback panel, no matter who is logged in, or what is scheduled.

The fallpack panel being read is the locale.loggedout content, located in ./promoPanel.locale

Note: this is not a magic bullet, but is something that will at least remove any widespread front page errors shown to any and all users on the front page if required.
