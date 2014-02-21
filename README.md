# angular-float-label


An implementation of the [Float Label Pattern](http://bradfrostweb.com/blog/post/float-label-pattern/) for Angular. At this stage the code is still very much in its baby-state, so treat it as such (not production ready).

## Installation

```js
$ bower install kasperlewau/angular-float-label
```
**or** just grab the [source](https://raw.github.com/kasperlewau/angular-float-label/master/angular-float-label.js).

### Inclusion

```javascript
var app = angular.module('myModule', ['kasperlewau.angular-float-label', ...]);
```

### Example

![alt text](http://cl.ly/image/192v0U053F1I/out2.gif "out2.gif")

### Useage
```css
.fl-input, .fl-textarea {
  // Some basics
  display: inline-block;
  margin-right: 10px;
  position: relative;
  input, label, textarea {
    transition: all ease-in-out .15s;
    width: 100%;
  }
  label {
    // Inline label state.
    position: absolute;
    font-size: 12px;
    top: -1.1em;
    left: 5px;
    opacity: 0;
  }
  &.fl-focused, &.fl-populated {
    // Flyout label state.
    label { opacity: 1; top: -1.5em; left: 5px; }
  }
}
```
```html
<form>
  <div class="inputs">
    <input type="email" float-label="Email" ng-model="usr.email" required>
    <input type="text" float-label="Name" ng-model="usr.name">
    <input type="password" float-label="Password" ng-model="usr.pw" required>
    <textarea float-label="Presentation" ng-model="usr.presentation">
  </div>
</form>
```

### To-dos
- [ ] Move away from the oh-so-stupid setTimeout() on init.
- [ ] Move DOM transforming to compile().
- [ ] Add hosted demo with examples.

### License

MIT