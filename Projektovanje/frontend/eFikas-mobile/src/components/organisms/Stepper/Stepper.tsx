import { Colors } from "@/src/styles/style";
import { ProgressStep, ProgressSteps } from "react-native-progress-steps";

export interface CustomProgressStepProps {
	label: string;
	buttonNextText?: string;
	buttonPreviousText?: string;
	buttonNextTextColor?: string;
	buttonPreviousTextColor?: string;
	componentToRender?: React.ReactNode;

	onNextStep?: () => void;
	onPreviousStep?: () => void;
}

interface StepperProps {
	progressSteps: CustomProgressStepProps[];
	activeStep: number;
}

export default function Stepper(props: StepperProps) {
	return (
		<ProgressSteps 
			completedCheckColor={"#FFFFFF"} 
			activeStepNumColor={Colors.textPrimary} 
			activeStepIconBorderColor={Colors.primary}
			completedProgressBarColor={Colors.primary}
			completedStepIconColor={Colors.statusAvailable}
			
			activeStep={props.activeStep}
			
		>
			{props.progressSteps.map((step, index) => {
				return(
					<ProgressStep 
						key={index} 
						label={step.label} 
						buttonPreviousText={step.buttonPreviousText} 
						buttonPreviousTextColor={Colors.tertiary}
						onPrevious={step.onPreviousStep}
						buttonNextText={step.buttonNextText} 
						buttonNextTextColor={Colors.background} // TODO: Find better workaround to hide it
						onNext={step.onNextStep}
						buttonNextDisabled={true}
					>
						{step.componentToRender}
					</ProgressStep>
				);
			})}
		</ProgressSteps>
	);
}