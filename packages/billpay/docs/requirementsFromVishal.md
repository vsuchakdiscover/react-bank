1.  Customer's existing Payments Reminders - Please confirm that I should use get payees and inspect the 'reminder' property. If property exists customer is enrolled, correct? Please provide a list of the possible values for reminder.frequency.

Yes this is correct. If you see reminder property in response that means payee is enrolled into reminders.

     2. Customer's email where reminders are sent, Editing the email

Is this a separate api call to profile or other endpoint to show and edit email? Please let us know how this should work. I'm wondering if the customer's email could be added to the get payees response.

Still working on it as scope for this has changed from current BAU.

3. Payee Dropdown - Please confirm that the accounts to show here are the payees with reminderEligible:true. Can a payee have more than one payment reminder assigned to it or do we exclude accounts that already have a payment reminder scheduled?

reminderEligible:true – Means payee is eligible for reminders.

Payee can have only one reminder set. So we have to exclude payees from the dropdown which has a reminder already scheduled.

4. Next Payment Date / Calendar - Please provide rules on available dates to show - assuming that we exclude dates in the past, weekends and bank holidays. Default date would be today or next available? (I think there is an existing api that returns bank holidays.)

That’s correct. Default will be next available day. We will expose one endpoint for bank holidays.
