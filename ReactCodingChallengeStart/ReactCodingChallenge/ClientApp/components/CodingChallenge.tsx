import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as CodingChallengeState from '../store/CodingChallenge';

// At runtime, Redux will merge together...
type CodingChallengeProps =
    CodingChallengeState.CodingChallengeState         // ... state we've requested from the Redux store
    & typeof CodingChallengeState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>;  

class CodingChallenge extends React.Component<CodingChallengeProps, {}> {
    state = {
        imageCount: 0,
        crewCapacity: []
    };
    componentWillMount() {
        // This method runs when the component is first added to the page
        let input: CodingChallengeState.CodingChallengeInput = this.props.input;
        this.props.requestCodingChallenge({ ...input }, true);
    }

    public render() {
        return <div>
            <h1>Coding challenge</h1>
            <p>This component demonstrates a datadriven, dynamic SPA talking to a backend REST API</p>
            {this.renderForm()}
        </div>;
    }
    public renderCrewSize()
    {
        var htmlList = [];
        const { codingChallenge, input, isLoading } = this.props;
        //if (this.state.crewSize > 0)
        {
            for (var i = 0; i < input.crewCapacity.length; i++)
            {
                htmlList.push(
                    <div className="form-group row" key={i}>
                        <div className="col-md-6">
                            <input data-for={i} value={input.crewCapacity[i] ? input.crewCapacity[i] : ''} type="number" onChange={(e) => {
                                var arrayIndex = e.target.getAttribute('data-for');
                                var existingArray = input.crewCapacity.slice() as number[];
                                if (arrayIndex)
                                {
                                    var index = parseInt(arrayIndex);
                                    existingArray[index] = e.target.value ? parseInt(e.target.value) : 0;
                                    this.props.requestCodingChallenge({ ...input, crewCapacity: existingArray });
                                }
                            }} required className="form-control" placeholder={'Crew # ' + (i + 1)} />
                        </div>
                        <div className="col-md-6">
                            {codingChallenge ? codingChallenge.crewProductivity[i] : ""}
                        </div>
                    </div>
                );
            }
        }

        return <div style={{ marginTop: '20px' }}>{htmlList}</div>;
    }
    private renderForm() {
        const { codingChallenge, input, isLoading } = this.props;
        if (codingChallenge === undefined) {
            return <div>Images:<br />No coding challenge defined...</div>;
        }
        // TODO: make imageCount, crew productivity and crew size variable
        return (
            <div>
                <form>
                    <div>
                        <div className="form-row">
                            <div className="form-group col-md">
                                <label>No of Images</label>
                                <input type="number" value={input.imageCount ? input.imageCount : ''} className="form-control" placeholder="# of images" onChange={(e) => {
                                    console.log(e.target.value);
                                    this.props.requestCodingChallenge({ ...input, imageCount: e.target.value ? parseInt(e.target.value) : 0 })
                                }} />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <button type="button" className="btn btn-primary" onClick={(e) => {
                                    var newArray = input.crewCapacity.length > 0 ? [...input.crewCapacity, 0] : [0];
                                    this.props.incrementCrewSize({...input, crewCapacity: newArray});
                                }}>Add Crew</button>
                                <button type="button" className="btn btn-primary col-3" onClick={(e) => {
                                    var existingArray = input.crewCapacity.slice();
                                    existingArray.pop();
                                    this.props.decrementCrewSize({ ...input, crewCapacity: existingArray });
                                }}>Delete Crew</button>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                {this.renderCrewSize()}
                            </div>
                            <div className="col-md-5">
                                <div className="alert alert-primary" role="alert">
                                    <h3>{"Required Time to Edit images: " + codingChallenge.minutes}</h3> 
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            );
    }
}

export default connect(
    (state: ApplicationState) => state.codingChallenge, // Selects which state properties are merged into the component's props
    CodingChallengeState.actionCreators                 // Selects which action creators are merged into the component's props
)(CodingChallenge as any) as typeof CodingChallenge;
