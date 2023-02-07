-- creates a row count column, selects id, transaction number, and creation date, and creates a timestamp based on the creation date.
-- used for checking if the mobile app is correctly fetching transactions through the api when given an input timestamp

SET @row_number = 0;
SELECT (@row_number:=@row_number + 1) AS row_number, t.id, t.transaction_number, t.created_date, UNIX_TIMESTAMP(STR_TO_DATE(t.created_date, '%Y-%m-%d %H:%i:%s')) AS timestamp FROM transactions t WHERE id_users = 16 ORDER BY t.created_date DESC;


-- query used by the api to list transcations

SELECT t.id, t.created_date, t.transaction_number, t.status, r.firstname, r.lastname, r.accountnumber,
r.accounttype, r.bankname, r.branchname, r.branchcity, t.transfer_amount, t.rate, t.received_amount, t.today_rate,
t.fee_AUD, t.purpose, t.processed_date, t.completed_date, t.id_receivers
FROM transactions t, receivers r
WHERE ( t.id_receivers = r.id
AND t.id_users = 16
AND t.created_date < '2023-01-19 21:12:15' ) ORDER BY t.created_date DESC LIMIT 10;