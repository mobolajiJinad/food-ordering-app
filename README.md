# Food Ordering App

## NOTE

Admin is used to refer to cooks or chefs advertise and sell their foods.<br>
User refers to customers interested in ordering.<br>
All routes and form names should be same
<br><br>

## Creating the sign up page for admin

_NOTE: Username and password must be provided._<br>
_Example_

```
html

<form action="/auth/admin/signup" method="post">
  <label for="username">username</label>
  <input type="text" name="username" id="">

  <label for="password">password</label>
  <input type="password" name="password" id="">

  <input type="submit" value="Sign Up">
</form>
```

## Creating the login up page for admin

_NOTE: Username and password must be provided._<br>
_Example_

```
html

<form action="/auth/admin/login" method="post">
  <input type="text" name="username" id="", placeholder="Enter username">

  <label for="password">Enter password</label>
  <input type="password" name="password" id="">

  <input type="submit" value="Log in">
</form>
```

## To log admin out

_Example_

```
html

<a href="admin/settings/account/logout">Logout</a>
```

## Getting admin to upload their foods

_Example_

```
html

<!--NOTE: All fields are required -->

<form action="/admin/food/upload" method="post">
  <label for="name">Name of food:</label>
  <input type="text" name="name" id="">

  <label for="description">Description: </label>
  <textarea name="description" id="" cols="30" rows="10"></textarea>

  <!--Price should be a number-->
  <label for="price">Price: </label>
  <input type="number" name="price" id="">

  <!--Quantity should also be a number-->
  <label for="price">Quantity: </label>
  <input type="number" name="quantity" id="">

  <label for="image">Upload your food/dish image</label>
  <input type="file" name="image" id="">

  <input type="submit" value="Add">
</form>
```

## Deleting an admin's food

_Example_

```
html

<!--NOTE: this should be a delete request-->

<a href="/admin/food/:foodId">Delete</a>
```

## Getting all admin's foods

_Example_

```
html

<a href="/admin/foods">Get all your products</a>
```

## Getting all admin foods that have been ordered

_Example_

```
html

<a href="admin/orders">Check foods ordered.</a>
```

<br>

## Creating the sign up page for users.

### To sign up using username, password and/or email.

_NOTE: Either username or email or both need to be provided with password._<br>
_Example_

```
html

<form action="/auth/user/signup" method="post">
  <label for="username">username</label>
  <input type="text" name="username" id="">

  <label for="email">email</label>
  <input type="text" name="email" id="">

  <label for="password">password</label>
  <input type="password" name="password" id="">

  <input type="submit" value="Sign Up">
</form>
```

### To sign up using google.<br>

_Example._

```
html

<a href="/auth/user/google">Log in with google</a>
```

## Creating the log in page for users

Users can log in using either username or email

```
html

<form action="/auth/user/login" method="post">
  <input type="text" name="usernameOrEmail" id="", placeholder="Enter either username or email">

  <label for="password">Enter password: </label>
  <input type="password" name="password" id="">

  <input type="submit" value="Log in">
</form>
```

## To log user out

_Example_

```
html

<a href="user/settings/account/logout">Logout</a>
```

## To get all food available to order to users

_Example_

```
html

<a href="user/foods">See all foods available for order</a>
```

## To make an order

_Example_

```
html

<a href="user/foods/:foodId/order">Order this food.</a>
```

## To rate an ordered food

_Example_

```
html

<a href="user/foods/:foodId/rate">Rate this food</a>
```
