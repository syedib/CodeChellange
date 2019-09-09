
class App extends React.Component
{
	state = {
		name: 'Tariq',
		age: 1.5
	}
	handleClick = (e) => {
		console.log(e.target.value); 
	}
	handleChange = (e) => {
		this.setState({
			name: e.target.value
		})
	}
	handleSubmit = (e) => {
		e.preventDefault();
		console.log(this.state);
	}
	render()
	{
		return(
			<div>
				<h5>React with CDN</h5>
				<p>My name is { this.state.name } and i am { this.state.age }</p>
				<form onSubmit={this.handleSubmit}>
					<input type="text" onChange={this.handleChange}></input>
					<button type="submit">Click me</button>
				</form>
			</div>
		);
	}
}
ReactDOM.render(<App/>, document.getElementById('root'));