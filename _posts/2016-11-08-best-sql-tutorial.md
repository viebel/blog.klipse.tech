---
layout: post
title:  "An interactive way of writing SQL tutorials"
description:  "An interactive way of writing SQL tutorials"
date:   2016-11-07 12:17:52 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "231003A7-5D6F-474D-9602-74343248C053"
author: Yehonathan Sharvit
minified_plugin: true
draft: true
hidden: true
klipse_editor_type: "html"
---

# SQL

From today, we can run SQL queries with KLIPSE.

# CREATE TABLE

~~~klipse-sql
CREATE TABLE play (game, points, day)
~~~

# INSERT values

~~~klipse-sql
INSERT INTO play VALUES ("go", 500, "monday"),
("go", 300, "tuesday"),
("chess", 1250, "tuesday"),
("chess", 1250, "tuesday"),
("chess", 50, "sunday"),
("checkers", 100, "monday"),
("chess", 3200, "saturday");
~~~

# SELECT

Let's check the contents of our table:

~~~klipse-sql
SELECT * from play;
~~~

# GROUP BY

~~~klipse-sql
SELECT game, sum(points) as total_points FROM play GROUP BY game
~~~

# HAVING vs. WHERE

`WHERE` is for columns that are part of the table.

~~~klipse-sql
SELECT game, points FROM play WHERE points > 10
~~~

`HAVING` is for examinating the results of aggregation functions.

~~~klipse-sql
SELECT game, sum(points) as total_points FROM play GROUP BY game HAVING total_points > 10
~~~


# JOIN 

Let's create another table in order to explore the joy of `join`.

Our new table is called `settings` and it contains the settings of the game:

- `point_value`: how much in dollars each point worths?

~~~klipse-sql
CREATE TABLE settings (game, point_value)
~~~


Let's insert a row for each game - except for `checkers`:

~~~klipse-sql
INSERT INTO settings VALUES ("go", 1000),
("chess", 500);
~~~


Now, let's join the `play` and `settings` table:

~~~klipse-sql
select * from play left join settings where play.game = settings.game;
~~~

# Table alias

Sometimes, you want to join bewteen results of other queries. In that case, the result of the query is a table that Then you need to alias your table in order to let

~~~klipse-sql
~~~
