import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Login from '../pages/login/Login';
const wrapper = shallow(<Login />);

it('renders without crashing', () => {
    shallow(<Login />);
});

it('wraper is div', () => {
    expect(wrapper.is('div')).toBe(true)
})

it('button exists', () => {
    expect(wrapper.find('button')).toBeTruthy();
});

it('email input has text', () => {
    const button = wrapper.find('#formEmail');
    expect(button.text()).toBe('Email address');
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

it('button login has text', () => {
    const button = wrapper.find('#buttonLogin');
    expect(button.text()).toBe('Login');
})

it('button login exist', () => {
    const button = wrapper.find('#buttonLogin');
    expect(button.exists()).toBeTruthy();
})

it('button password reset has text', () => {
    const button = wrapper.find('#buttonPasswordReset');
    expect(button.text()).toBe('Password Reset');
})

it('button password reset exist', () => {
    const button = wrapper.find('#buttonPasswordReset');
    expect(button.exists()).toBeTruthy();
})

it('singup link has text', () => {
    const button = wrapper.find('#registerInfo');
    expect(button.text()).toBe('Dont have account?');
})