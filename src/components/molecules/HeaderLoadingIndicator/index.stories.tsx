import React from 'react';
import HeaederLoadingIndicator from './index';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

type Item = {
    label: string;
    ratio: number;
    loading: boolean;    
};

class Test extends React.PureComponent<{}, { item: Item }> {
    items = [{
        label: '',
        ratio: 0,
        loading: false,
    }, {
        label: 'はてなブックマークを読み込んでいます',
        ratio: 20,
        loading: true,
    }, {
        label: 'Facebookを読み込んでいます',
        ratio: 50,        
        loading: true,
    }, {
        label: 'Pocketを読み込んでいます',
        ratio: 80,
        loading: true,
    }, {
        label: '',
        ratio: 100,
        loading: false,
    }];
    index = 0;
    state = { item: this.items[0] };
    constructor(props: any) {
        super(props);
        this.clickButton = this.clickButton.bind(this);
    }
    clickButton() {
        this.index = this.index === this.items.length - 1 ? 0 : this.index + 1;
        this.setState({ item: this.items[this.index] });
    }
    render() {
        return (
            <Wrapper onClick={this.clickButton}>
              <HeaederLoadingIndicator ratio={this.state.item.ratio} label={this.state.item.label} loading={this.state.item.loading}/>
            </Wrapper>
        );
    }
}

storiesOf('molecules/HeaederLoadingIndicator', module)
.add('default', () => <Test />);

const Wrapper = styled.div`
width: 100%;
`;