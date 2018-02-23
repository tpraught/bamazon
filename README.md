# bamazon
Combining node.js and MySQL in an Amazon-ish Storefront

Main Objective
 - Create a database in MySQL to keep track of stock of products, sales, and revenue
 - Create a node.js interface in the command line to allow for:
   - View a list of the products, the cost, and available quantity
   - Allow a user to purchase products
   - Notify user if there isn't sufficient stock
   - When purchase is completed, show the total cost of the purchase
 
 Bonuses
  - When purchase is complete:
    - Update available stock in the products database
    - Update the total sales in the products database
    - Update the department revenue in the departments database

-------------------------------------------------------------------------------------------

View a short video of how this application works: https://youtu.be/76qDpYpD3PI

-------------------------------------------------------------------------------------------

Additional Development Opportunities:
 - Manager App:
   - View all products for sale (list every available item - ID, name, price, and stock)
   - View all products with a low inventory (list items with inventory lower than 5)
   - Add inventory (prompt manager to add stock of any items currently available)
   - Add a new product (allow manager to add a completely new product)

 - Supervior App
   - View product sales by department
   - Create a new department