# qt-wrapper

A simple wrapper around [autoscend](https://github.com/Loathing-Associates-Scripting-Society/autoscend) that pulls expensive and high turn gen items. It also attempts to make use of some newer IotM.

To install, type

```
svn delete qt-wrapper
svn checkout https://github.com/pstalcup/qt-wrapper/branches/master/KolMafia/
```

# running it

## Restocking

Before ascending, type

```
qt-wrapper stock
```

to buy the required items to be pulled (note some of them are expensive, so you may need to buy them by hand depending on your automation settings)

After ascending, on day 1, type

## Day 1

```
qt-wrapper day1
```

This will pull turn-bloat items, and use the backup camera to burn delay. When it is done, run autoscend

```
autoscend
```

## Day 2

```
qt-wrapper day2
```

This will pull items to do the mob of zeppelin protesters and turn bloat, as well as burn initial delay in Shen's nightclub. After it is done, run autoscend

```
autoscend
```

Credits:

Credit to the whole Autoscend team
Credit to phred for a PR and help on Day 1
Credit to Phil for reporting a bug on combat in cobb's knob
Credit to SSBBHax for ideas about how to turnbloat and what else to do
