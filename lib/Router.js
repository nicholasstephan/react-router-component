"use strict";

var React = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var RouterMixin = require('./RouterMixin');
var AsyncRouteRenderingMixin = require('./AsyncRouteRenderingMixin');

/**
 * Create a new animated router class. Uses a ReactJS 
 * [CSSTransitionGroup](http://facebook.github.io/react/docs/animation.html)
 * to transition routes. 
 *
 * @param {String} name
 * @param {ReactComponent} component
 */
function createAnimatedRouter(name, component) {

  return React.createClass({

      mixins: [RouterMixin, AsyncRouteRenderingMixin],

      getRoutes: function() {
        return this.props.children;
      },

      render: function() {

        var handler = this.renderRouteHandler();
        var isPopState = this.state.navigation.isPopState;
        var enabled = isPopState ?
                      !!this.props.popStateTransitionName :
                      !this.state.navigation.noTransition;
        var props = {
          component: React.DOM.div,
          transitionEnter: enabled,
          transitionLeave: enabled,
        };

        if (isPopState && this.props.popStateTransitionName) {
          props.transitionName = this.props.popStateTransitionName;
        } else if (this.state.navigation.transitionName) {
          props.transitionName = this.state.navigation.transitionName;
        }

        handler.props.key = this.state.match.path;
        return this.transferPropsTo(CSSTransitionGroup(props, handler));

      }
  });
}

/**
 * Create a new router class
 *
 * @param {String} name
 * @param {ReactComponent} component
 */
function createRouter(name, component) {

  return React.createClass({

    mixins: [RouterMixin, AsyncRouteRenderingMixin],

    displayName: name,

    getRoutes: function(props) {
      return props.children;
    },

    getDefaultProps: function() {
      return {
        component: component
      }
    },

    render: function() {
      var handler = this.renderRouteHandler();
      return this.transferPropsTo(this.props.component(null, handler));
    }
  });
}

module.exports = {
  createRouter: createRouter,
  AnimatedLocations: createAnimatedRouter('AnimatedLocations', React.DOM.div),
  Locations: createRouter('Locations', React.DOM.div),
  Pages: createRouter('Pages', React.DOM.body),
}
