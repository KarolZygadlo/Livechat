import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Profile from '../pages/profile/Profile';
const wrapper = shallow(<Profile />);

it('renders without crashing', () => {
    shallow(<Profile />);
});

it('wraper is div', () => {
    expect(wrapper.is('div')).toBe(true)
})

it('button exists', () => {
    expect(wrapper.find('button')).toBeTruthy();
});

it('photo input exist', () => {
    const button = wrapper.find('#photoInput');
    expect(button.exists()).toBeTruthy();
})

it('nickname input exist', () => {
    const button = wrapper.find('#nicknameInput');
    expect(button.exists()).toBeTruthy();
})

it('update button exist', () => {
    const button = wrapper.find('#buttonUpdate');
    expect(button.exists()).toBeTruthy();
})

it('password reset button exist', () => {
    const button = wrapper.find('#buttonReset');
    expect(button.exists()).toBeTruthy();
})

it('go back button exist', () => {
    const button = wrapper.find('#buttonBack');
    expect(button.exists()).toBeTruthy();
})