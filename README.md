# Food Ordering App

## Creating the sign up page

### To sign up using username, password and/or email.

_NOTE: Either username or email or both need to be provided._<br>
_Example_

```
html

<!-- All routes and form names should be same -->

<form action="/auth/signup" method="post">
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

<!-- All routes and form names should be same -->

<a href="/auth/google">Log in with google</a>
```

## Creating the log in page

Users can log in using either username or email

```
html

<!-- All routes and form names should be same -->

<form action="/auth/login" method="post">
  <input type="text" name="usernameOrEmail" id="", placeholder="Enter either username or email">

  <label for="password">Enter password: </label>
  <input type="password" name="password" id="">
</form>
```

## To log user out

_Example_

```
html

<!-- All routes and form names should be same -->

<a href="auth/logout">Logout</a>
```
