import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Home from '../pages/home/Home';
const wrapper = shallow(<Home />);

it('renders without crashing', () => {
    shallow(<Home />);
});

it('renders welcome message', () => {
    const welcome = <h1>Welcome to Desktop Chat Application</h1>;
    expect(wrapper.contains(welcome)).toEqual(true);
});

it('button exists', () => {
    expect(wrapper.find('button')).toBeTruthy();
});

it('renders button with text Login to application', () => {
    const button = <button id="login-button" type="button" className="btn btn-primary btn-lg btn-block">Login to application</button>;
    expect(wrapper.contains(button)).toBeTruthy();
});

it('button login is visible', () => {
    const button = wrapper.find('#login-button');
    expect(button.exists()).toBeTruthy();
})


it('button login has text', () => {
    const button = wrapper.find('#login-button');
    expect(button.text()).toBe('Login to application');
})

it('wraper is div', () => {
    expect(wrapper.is('div')).toBe(true)
  })
