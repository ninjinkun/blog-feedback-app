import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { RouteComponentProps } from 'react-router';

type Props = RouteComponentProps;

export default function withTracker<T extends Props>(WrappedComponent: React.ComponentType<T>, options: any = {}) {
  const trackPage = (page: string) => {
    ReactGA.set({
      page,
      ...options,
    });
    ReactGA.pageview(page);
  };

  const HOC = class extends Component<T> {
    componentDidMount() {
      const page = this.props.location.pathname;
      trackPage(page);
    }

    componentWillReceiveProps(nextProps: T) {
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
}
