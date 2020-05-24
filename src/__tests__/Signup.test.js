import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Signup from '../pages/signup/Signup';
const wrapper = shallow(<Signup />);

it('renders without crashing', () => {
    shallow(<Signup />);
});

it('wraper is div', () => {
    expect(wrapper.is('div')).toBe(true)
})

it('button exists', () => {
    expect(wrapper.find('button')).toBeTruthy();
});

it('email input has label', () => {
    const button = wrapper.find('#formEmail');
    expect(button.text()).toBe('Email addressWe will never share your email with anyone else.');
})

it('email input exist', () => {
    const button = wrapper.find('#formEmail');
    expect(button.exists()).toBeTruthy();
})

it('password input has text', () => {
    const button = wrapper.find('#formPassword');
    expect(button.text()).toBe('Password');
})

it('password input exist', () => {
    const button = wrapper.find('#formPassword');
    expect(button.exists()).toBeTruthy();
})

it('button submit has text', () => {
    const button = wrapper.find('#buttonSubmit');
    expect(button.text()).toBe('Submit');
})

it('button submit exist', () => {
    const button = wrapper.find('#buttonSubmit');
    expect(button.exists()).toBeTruthy();
})

it('information has text', () => {
    const button = wrapper.find('#infoText');
    expect(button.text()).toBe('Already have an account?');
})

it('information text exist', () => {
    const button = wrapper.find('#infoText');
    expect(button.exists()).toBeTruthy();
})

it('login link has text', () => {
    const button = wrapper.find('#loginInfo');
    expect(button.text()).toBe('Go to login page');
})

it('login link exist', () => {
    const button = wrapper.find('#loginInfo');
    expect(button.exists()).toBeTruthy();
})