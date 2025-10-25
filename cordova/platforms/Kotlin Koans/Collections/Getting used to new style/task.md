## Getting used to new style

We can rewrite and simplify the following code using lambdas and operations on collections.
Fill in the gaps in `doSomethingWithCollection`, 
the simplified version of the `doSomethingWithCollectionOldStyle` function, 
so that its behavior stays the same and isn't modified in any way.

```kotlin
fun doSomethingWithCollectionOldStyle(
    collection: Collection
): Collection? {
    val groupsByLength = mutableMapOf&gt;()
    for (s in collection) {
        var strings: MutableList? = groupsByLength[s.length]
        if (strings == null) {
            strings = mutableListOf()
            groupsByLength[s.length] = strings
        }
        strings.add(s)
    }

    var maximumSizeOfGroup = 0
    for (group in groupsByLength.values) {
        if (group.size &gt; maximumSizeOfGroup) {
            maximumSizeOfGroup = group.size
        }
    }

    for (group in groupsByLength.values) {
        if (group.size == maximumSizeOfGroup) {
            return group
        }
    }
    return null
}
```
