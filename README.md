# angular-float-label


An implementation of the [Float Label Pattern](http://bradfrostweb.com/blog/post/float-label-pattern/) for Angular. At this stage the code is still very much in its baby-state, so treat it as such (not production ready).

## Installation

```js
$ bower install kasperlewau/angular-float-label
```
**or** just grab the [source](https://raw.github.com/kasperlewau/angular-float-label/master/angular-float-label.js).

### Inclusion

```js
var app = angular.module('myModule', ['kl.angular-float-label', ...]);
```

### Example

![alt text](http://cl.ly/image/192v0U053F1I/out2.gif "out2.gif")

### Useage

```css
.fl-input, .fl-textarea {
  position: relative;
  input, label, textarea {
    transition: all ease-in-out .15s;
  }
  label {
    position: absolute;
    top: -1.1em;
    left: 5px;
    opacity: 0;
  }
  &.fl-focused, &.fl-populated {
    label {
      opacity: 1;
      top: -1.5em;
      left: 5px;
    }
  }
}
```

```html
<form>
  <input type="email" float-label="Email" ng-model="usr.email" required>
  <textarea float-label="Description" ng-model="usr.description"></textarea>
</form>
<!-- becomes -->
<form>
  <div class="fl-input">
    <label for="usr-email">Email</label>
    <input type="email" float-label="Email" ng-model="usr.email" required="" name="usr-email" class="ng-pristine ng-invalid ng-invalid-required ng-valid-email">
  </div>
  <div class="fl-textarea">
    <label for="usr-description">Description</label>
    <textarea float-label="Description" ng-model="usr.description" name="usr-description" class="ng-pristine ng-valid"></textarea>
  </div>
</form>
```

### To-dos
- [ ] Write tests
- [x] Move away from the oh-so-stupid setTimeout() on init.
- [ ] Handle HTML5 inline validation (its broken).
- [ ] Move DOM transforming to compile().
- [ ] Add hosted demo with examples // Improve README.
- [ ] Add support for passed in opts as args
  - [ ] Classes
  - [ ] Animation
  - [ ] Predefined type
- [ ] Probably 100 other things I've yet to think of.

### License

MIT