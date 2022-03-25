import React from 'react';
import { shallow, mount, render } from 'enzyme';
import render from '../client/src/component/Wrapper/index';

it('renders the Create Poll text on link', () => {
    // Clicks on Create Poll link and renders page
    const wrapper = mount(render())
    wrapper.find({childred: Link})
    expect(wrap.text()).toEqual('Create Poll')
});

it('renders the View Poll texton link', () => {
    // Clicks on View Poll link and renders page
    wrapper.find({childred: Link})
    expect(wrap.text()).toEqual('View Poll')
});


