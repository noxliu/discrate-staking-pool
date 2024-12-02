# Example 1

![staking](/images/discrate_pool.png)

Discrete staking rewards amount given can vary every second. In the above example, we could see when second 2 we added 100 tokens reward. When second 4 added 100 tokens reward. When second 6 added 100 tokens rewards.

Let's calculate Alice final staking reward by below:

1st secord = 0

2nd secord = 100 * 100/100 = 100 tokens

3rd secord = 0

4th secord = 0

5th secord = 100 * 200/300 = 200/3 tokens

6th secord = 0, withdraw 200

Sum all then could get the total is 100 + $ {200 \over 3} $ =  $ {500 \over 3} $ tokens

But this way is not good. It need calculate one's reward every second. The gas consuming is unacceptable.

The better way is just only re-calculate the per staking token earn how much reward when new rewards added into staking pool. And when any user stake or withdraw tokens, just save the currently reward index value for this user. Like below:

<font size="3">I<font size="1">x</font></sub></font> is the per token earn value of x seconds:

<font size="3">I<sub><font size="1">x</font></sub> = I<sub><font size="1">p</font></sub> + $ {R \over S} $</font>

<font size="3">I<sub><font size="1">0</font></sub> = 0</font>

<font size="3">I<sub><font size="1">2</font></sub> = I<sub><font size="1">0</font></sub>  + $ {100 \over 100} $ </font>

<font size="3">I<sub><font size="1">5</font></sub> = I<sub><font size="1">2</font></sub>  + $ {100 \over 300} $ </font>

<font size="3">I<sub><font size="1">7</font></sub> = I<sub><font size="1">5</font></sub>  + $ {100 \over 100} $ </font>


We could use <font size="3">I<font size="1">x</font></sub></font> calculate everyone staking rewards:

## Alice:

I<sub><font size="1">Alice</font></sub> is the per tokens value Alice earned.

Alice stake 100 token when second 1, we need record current reward index value for Alice. 

R<sub><font size="1">Alice</font></sub> = 0

<font size="3">I<sub><font size="1">Alice</font></sub> = I<sub><font size="1">1</font></sub> = 0 </font>


Alice stake 100 token when second 3, we need calculate Alice reward that time index.

R<sub><font size="1">Alice</font></sub> = R<sub><font size="1">Alice</font></sub> + 100 (I<sub><font size="1">2</font></sub> - I<sub><font size="1">Alice</font></sub>) = 100( $ {100 \over 100} $ - I<sub><font size="1">Alice</font></sub>) = 100 tokens

I<sub><font size="1">Alice</font></sub> = I<sub><font size="1">2</font></sub>

Alice withdraw 200 token when second 6, we need calculate Alice reward that time index.

R<sub><font size="1">Alice</font></sub> = R<sub><font size="1">Alice</font></sub> + 200 (I<sub><font size="1">5</font></sub> - I<sub><font size="1">Alice</font></sub>) = 100 + 200( I<sub><font size="1">2</font></sub> + $ {100 \over 300} $ - I<sub><font size="1">2</font></sub>) = $ {500 \over 3} $ tokens

<!-- I<sub><font size="1">Alice</font></sub> = I<sub><font size="1">4</font></sub> -->

<!-- Alice withdraw 200 token when second 6, we need calculate Alice reward that time index. -->

<!-- R<sub><font size="1">Alice</font></sub> = $ {500 \over 3} $ + 0 (I<sub><font size="1">4</font></sub> - I<sub><font size="1">Alice</font></sub>) = $ {500 \over 3} $ tokens -->

Then Alice final rewards is $ {500 \over 3} $ tokens

We could calculate Bob earn by same way:

## Bob:

Bob stake 100 token when second 4, we need record current reward index value of Bob. 

<font size="3">I<sub><font size="1">Bob</font></sub> = I<sub><font size="1">4</font></sub> = I<sub><font size="1">2</font></sub> </font>

R<sub><font size="1">Bob</font></sub> = 0

Bob withdraw 100 token when second 8, we need record current reward index value of Bob. 

R<sub><font size="1">Bob</font></sub> =  100 (I<sub><font size="1">8</font></sub> - I<sub><font size="1">Bob</font></sub>) = 100 ($ {100 \over 100} $ + $ {100 \over 300} $) =$ {400 \over 3} $ tokens





## Example 2:

We have unit test code to verify the following example:

![staking](/images/discrate_pool2.png)
