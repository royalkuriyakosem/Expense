-- Use the expense_tracker database
USE expense_tracker;

-- Set a different delimiter for defining the triggers
DELIMITER //

-- Trigger to update total_expense after an expense is inserted
CREATE TRIGGER expenses_AFTER_INSERT 
AFTER INSERT ON expenses 
FOR EACH ROW 
BEGIN
    DECLARE existing_total DECIMAL(10, 2);

    -- Check if the category already exists in expense_each_category
    SELECT total_expense INTO existing_total
    FROM expense_each_category
    WHERE category = NEW.category;

    IF existing_total IS NOT NULL THEN
        -- If it exists, update the total_expense
        UPDATE expense_each_category
        SET total_expense = total_expense + NEW.amount
        WHERE category = NEW.category;
    ELSE
        -- If it does not exist, insert a new record
        INSERT INTO expense_each_category (category, total_expense)
        VALUES (NEW.category, NEW.amount);
    END IF;
END//

-- Trigger to update total_income after an income is inserted
CREATE TRIGGER incomes_AFTER_INSERT 
AFTER INSERT ON incomes 
FOR EACH ROW 
BEGIN
    DECLARE existing_income_total DECIMAL(10, 2);

    -- Check if the source already exists in income_per_source
    SELECT total_income INTO existing_income_total
    FROM income_per_source
    WHERE source = NEW.source;

    IF existing_income_total IS NOT NULL THEN
        -- If it exists, update the total_income
        UPDATE income_per_source
        SET total_income = total_income + NEW.amount
        WHERE source = NEW.source;
    ELSE
        -- If it does not exist, insert a new record
        INSERT INTO income_per_source (source, total_income)
        VALUES (NEW.source, NEW.amount);
    END IF;
END//

-- Reset the delimiter back to the default
DELIMITER ;
