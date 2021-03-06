import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  View,
  Animated
} from 'react-native';

import { getTouchableComponent } from './utils/touchable';

const DEVICE_WIDTH = Dimensions.get('window').width;

class FloatingActionItem extends Component {
  constructor(props) {
    super(props);

    this.animation = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== this.props.active) {
      Animated.spring(this.animation, { toValue: nextProps.active ? 1 : 0 }).start();
    }
  }

  handleOnPress = () => {
    const { name, onPress } = this.props;

    onPress(name);
  };

  renderText() {
    const { text, position, elevation, textElevation, textBackgroundColor, textColor } = this.props;

    if (Boolean(text)) {  // eslint-disable-line no-extra-boolean-cast
      return (
        <View key="text" style={[styles.textContainer, styles[`${position}TextContainer`], { elevation: textElevation || elevation || 5, backgroundColor: textBackgroundColor || "white" }]}>
          <Text style={[styles.text, { color: textColor || '#444444' }]}>
            {text}
          </Text>
        </View>
      );
    }

    return null;
  }

  renderButton() {
    const { icon, color, elevation } = this.props;

    let iconStyle;

    if (icon && icon.uri) {
      iconStyle = styles.iconLogo;
    } else {
      iconStyle = styles.icon;
    }

    return (
      <View key="button" style={[styles.button, { backgroundColor: color || '#1253bc', elevation: elevation || 5 }]}>
        {
          React.isValidElement(icon) ? icon : <Image style={iconStyle} source={icon} />
        }
      </View>
    );
  }

  render() {
    const { position } = this.props;
    const Touchable = getTouchableComponent();

    const animatedActionContainerStyle = {
      marginBottom: this.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [5, 20]
      })
    };

    const components = [];

    if (position === 'left') {
      components.push(this.renderButton());
      components.push(this.renderText());
    } else if (position === 'right') {
      components.push(this.renderText());
      components.push(this.renderButton());
    } else {
      components.push(this.renderButton());
    }

    return (
      <Touchable activeOpacity={0.4} style={styles.container} onPress={this.handleOnPress}>
        <Animated.View style={[styles.actionContainer, animatedActionContainerStyle]}>
          {
            components
          }
        </Animated.View>
      </Touchable>
    );
  }
}

FloatingActionItem.propTypes = {
  position: PropTypes.oneOf(['left', 'right', 'center']),
  color: PropTypes.string,
  icon: PropTypes.any,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  text: PropTypes.string,
  onPress: PropTypes.func
};

FloatingActionItem.defaultProps = {
  color: '#1253bc'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  actionContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  textContainer: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowColor: '#000000',
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 4,
    marginTop: 4,
    height: 28
  },
  leftTextContainer: {
    marginLeft: 14
  },
  rightTextContainer: {
    marginRight: 14
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444444'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowColor: '#000000',
    shadowRadius: 3,
    elevation: 5
  },
  iconLogo: {
    resizeMode: 'cover',
    width: 40,
    height: 40,
    borderRadius: 20
  },
  icon: {
    resizeMode: 'contain',
    width: 20,
    height: 20
  }
});

export default FloatingActionItem;
