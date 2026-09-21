# Normal DataWeave Questions & Answers — Additional Set

These are additional practical questions. They use different scenarios and outputs from the existing normal/basic set.

## DW-N21 — Calculate line-item subtotal
**Question:** Calculate the subtotal for each invoice line using quantity and unit price.
**Input**
    [{"sku":"A1","quantity":4,"unitPrice":25},{"sku":"B2","quantity":2,"unitPrice":80}]
**DataWeave**
    %dw 2.0
    output application/json
    ---
    payload map ($ ++ { subtotal: $.quantity * $.unitPrice })
**Output**
    [{"sku":"A1","quantity":4,"unitPrice":25,"subtotal":100},{"sku":"B2","quantity":2,"unitPrice":80,"subtotal":160}]
**Explanation:** Calculate a derived subtotal for every line.

## DW-N22 — Calculate tax amount
**Question:** Calculate 18% tax for an invoice amount.
**Input**
    {"invoiceId":"INV-10","amount":500}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    { invoiceId: payload.invoiceId, amount: payload.amount, tax: payload.amount * 0.18 }
**Output**
    {"invoiceId":"INV-10","amount":500,"tax":90}
**Explanation:** Multiply the amount by the tax rate.

## DW-N23 — Calculate invoice total including tax
**Question:** Add 18% tax to an invoice amount and return the final total.
**Input**
    {"amount":500}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    { subtotal: payload.amount, tax: payload.amount * 0.18, total: payload.amount + (payload.amount * 0.18) }
**Output**
    {"subtotal":500,"tax":90,"total":590}
**Explanation:** Combine the subtotal and calculated tax.

## DW-N24 — Create an inventory status
**Question:** Mark an item as IN_STOCK when quantity is greater than zero; otherwise mark it OUT_OF_STOCK.
**Input**
    {"sku":"P100","quantity":7}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    { sku: payload.sku, quantity: payload.quantity, status: if (payload.quantity > 0) "IN_STOCK" else "OUT_OF_STOCK" }
**Output**
    {"sku":"P100","quantity":7,"status":"IN_STOCK"}
**Explanation:** A numeric comparison determines the business status.

## DW-N25 — Create employee initials
**Question:** Return the first character of an employee's first and last names as initials.
**Input**
    {"firstName":"Ravi","lastName":"Kumar"}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    payload.firstName[0 to 0] ++ payload.lastName[0 to 0]
**Output**
    "RK"
**Explanation:** A range selector extracts one character from each name.

## DW-N26 — Extract an email domain
**Question:** Extract the domain from an email address.
**Input**
    {"email":"ravi@example.com"}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    (payload.email splitBy "@")[1]
**Output**
    "example.com"
**Explanation:** Split the address at the @ character and select the domain.

## DW-N27 — Normalize a phone number
**Question:** Remove spaces from a phone number before sending it to another API.
**Input**
    {"phone":"987 654 3210"}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    payload.phone replace " " with ""
**Output**
    "9876543210"
**Explanation:** replace removes the unwanted spaces.

## DW-N28 — Check an email domain
**Question:** Return true when an email belongs to the company.com domain.
**Input**
    {"email":"employee@company.com"}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    payload.email endsWith "@company.com"
**Output**
    true
**Explanation:** endsWith tests the required suffix.

## DW-N29 — Count active employees
**Question:** Return the number of active employees.
**Input**
    [{"name":"A","active":true},{"name":"B","active":false},{"name":"C","active":true}]
**DataWeave**
    %dw 2.0
    output application/json
    ---
    sizeOf(payload filter $.active)
**Output**
    2
**Explanation:** Filter active records and count the resulting array.

## DW-N30 — Get the first order
**Question:** Return the first order from an order array.
**Input**
    [{"id":"O1","amount":100},{"id":"O2","amount":200}]
**DataWeave**
    %dw 2.0
    output application/json
    ---
    payload[0]
**Output**
    {"id":"O1","amount":100}
**Explanation:** Array indexes start at zero.

## DW-N31 — Get the last order
**Question:** Return the last order from an order array.
**Input**
    [{"id":"O1","amount":100},{"id":"O2","amount":200}]
**DataWeave**
    %dw 2.0
    output application/json
    ---
    payload[-1]
**Output**
    {"id":"O2","amount":200}
**Explanation:** A negative index selects relative to the end of an array.

## DW-N32 — Reverse a priority list
**Question:** Reverse the order of a priority list.
**Input**
    ["HIGH","MEDIUM","LOW"]
**DataWeave**
    %dw 2.0
    output application/json
    ---
    reverse(payload)
**Output**
    ["LOW","MEDIUM","HIGH"]
**Explanation:** reverse returns the elements in reverse order.

## DW-N33 — Convert a role string into an array
**Question:** Split a comma-separated list of roles into an array.
**Input**
    {"roles":"ADMIN,USER,AUDITOR"}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    payload.roles splitBy ","
**Output**
    ["ADMIN","USER","AUDITOR"]
**Explanation:** splitBy separates a string using the supplied delimiter.

## DW-N34 — Convert roles into one string
**Question:** Join an array of roles into a comma-separated string.
**Input**
    ["ADMIN","USER","AUDITOR"]
**DataWeave**
    %dw 2.0
    output application/json
    ---
    payload joinBy ","
**Output**
    "ADMIN,USER,AUDITOR"
**Explanation:** joinBy combines array elements using the delimiter.

## DW-N35 — Remove leading and trailing spaces
**Question:** Clean whitespace around a customer name.
**Input**
    {"name":"  Ravi Kumar  "}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    trim(payload.name)
**Output**
    "Ravi Kumar"
**Explanation:** trim removes whitespace from both ends of a string.

## DW-N36 — Create a delivery priority
**Question:** Mark an order URGENT when its amount is at least 5000 and payment is confirmed; otherwise mark it NORMAL.
**Input**
    {"amount":7000,"paymentConfirmed":true}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    { amount: payload.amount, priority: if (payload.amount >= 5000 and payload.paymentConfirmed) "URGENT" else "NORMAL" }
**Output**
    {"amount":7000,"priority":"URGENT"}
**Explanation:** Both conditions must be true.

## DW-N37 — Select records with two conditions
**Question:** Return customers who are active and whose balance is greater than 10000.
**Input**
    [{"id":"C1","active":true,"balance":15000},{"id":"C2","active":false,"balance":20000},{"id":"C3","active":true,"balance":5000}]
**DataWeave**
    %dw 2.0
    output application/json
    ---
    payload filter ($.active and $.balance > 10000)
**Output**
    [{"id":"C1","active":true,"balance":15000}]
**Explanation:** filter keeps records satisfying both predicates.

## DW-N38 — Build a notification contact object
**Question:** Return only the contact information required by a notification service.
**Input**
    {"id":"C100","name":"Asha","email":"asha@example.com","phone":"9000000000","address":"Hyderabad"}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    { customerId: payload.id, email: payload.email, phone: payload.phone }
**Output**
    {"customerId":"C100","email":"asha@example.com","phone":"9000000000"}
**Explanation:** Explicit mapping creates the smaller downstream contract.

## DW-N39 — Create a balance status
**Question:** Return CREDIT for a positive balance, DEBIT for a negative balance, and ZERO for a zero balance.
**Input**
    {"balance":-250}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    { balance: payload.balance, status: if (payload.balance > 0) "CREDIT" else if (payload.balance < 0) "DEBIT" else "ZERO" }
**Output**
    {"balance":-250,"status":"DEBIT"}
**Explanation:** Multiple conditional branches classify the balance.

## DW-N40 — Convert a numeric string before arithmetic
**Question:** Convert the string amount 125.50 to a number and add 10.
**Input**
    {"amount":"125.50"}
**DataWeave**
    %dw 2.0
    output application/json
    ---
    (payload.amount as Number) + 10
**Output**
    135.50
**Explanation:** as Number converts text to a numeric type before arithmetic.

## Duplicate-control note
These entries were added as a separate set after searching the repository for the relevant existing topics and patterns. They do not duplicate the DW-N01 through DW-N20 question/answer pairs.