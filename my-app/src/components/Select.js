import React from 'react';
import Select from 'react-select';

class Selector extends React.Component {
    
  state = {
    selectedOption: null,
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });

    if (this.props.type === "action") {
        this.props.handleActionSelection(selectedOption)
    }

    if (this.props.type === "localeTo") {
        this.props.handleLocaleSelectionTo(selectedOption)
    }

    if (this.props.type === "localeFrom") {
        this.props.handleLocaleSelectionFrom(selectedOption)
    }

    
    console.log(`Option selected:`, selectedOption);
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={this.props.options}
      />
    );
  }
}

export default Selector