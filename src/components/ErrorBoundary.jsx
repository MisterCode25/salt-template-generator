import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null
        };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error("UI boundary caught an error", error, info);
    }

    componentDidUpdate(previousProps) {
        if (previousProps.resetKey !== this.props.resetKey && this.state.error) {
            this.setState({ error: null });
        }
    }

    reset = () => {
        this.setState({ error: null });
    };

    render() {
        if (this.state.error) {
            if (typeof this.props.fallback === "function") {
                return this.props.fallback({
                    error: this.state.error,
                    reset: this.reset
                });
            }
            return this.props.fallback || null;
        }

        return this.props.children;
    }
}
