-- Clean up duplicate billing subscriptions
-- Keep the latest record for each unique combination

DELETE FROM billing_subscriptions 
WHERE id NOT IN (
  SELECT MAX(id) 
  FROM billing_subscriptions 
  GROUP BY user_id, residence_id, COALESCE(ranking_category_id, ''), subscription_id
);

-- Verify no duplicates remain
SELECT user_id, residence_id, ranking_category_id, subscription_id, COUNT(*)
FROM billing_subscriptions 
GROUP BY user_id, residence_id, ranking_category_id, subscription_id 
HAVING COUNT(*) > 1;