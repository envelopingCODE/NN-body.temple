// guide.js - Let's build this like a story, where each step reveals new possibilities

// First, we'll set up our core building blocks - the steps in our journey
const GUIDE_STEPS = {
    intro: {
        title: "Find Your Perfect Massage",
        subtitle: "Our QuickGuide will help you choose from our range of therapeutic massages.",
        badges: ["⏱️ 2 minute guide", "🎯 Personalized match"]
    },
    focus: {
        question: "Which areas would you like to focus on?",
        options: [
            { emoji: "🙇🏻‍♂️", text: "Back & Shoulders", value: "back", description: "Target tension in upper body" },
            { emoji: "🦵", text: "Legs & Feet", value: "legs", description: "Revitalize tired legs" },
            { emoji: "🧍‍♂️", text: "Full Body", value: "full", description: "Complete relaxation journey" },
            { emoji: "🙂", text: "Face & Head", value: "face", description: "Release facial tension" }
        ]
    },
    intensity: {
        question: "What type of pressure do you prefer?",
        options: [
            { emoji: "🪶", text: "Light to Medium", value: "gentle", description: "Gentle, relaxing strokes" },
            { emoji: "💪", text: "Firm to Deep", value: "deep", description: "Deep tissue pressure" }
        ]
    },
    duration: {
        question: "How long would you like your session to be?",
        options: [
            { emoji: "⏱️", text: "25 minutes", value: "25", description: "Quick relief" },
            { emoji: "⏰", text: "50 minutes", value: "50", description: "Full session" },
            { emoji: "🕐", text: "80 minutes", value: "80", description: "Extended relaxation" }
        ]
    },
    aromatherapy: {
        question: "Would you like aromatherapy with your massage?",
        options: [
            { emoji: "🪔", text: "Yes please", value: true, description: "Enhanced with essential oils" },
            { emoji: "✨", text: "No thanks", value: false, description: "Classic massage only" }
        ]
    }
};

// Now, let's create our React component using browser-native syntax
function MassageGuide() {
    // Our state management
    const [currentStep, setCurrentStep] = React.useState('intro');
    const [preferences, setPreferences] = React.useState({});

    // Create elements for our intro section
    function createIntroSection() {
        const container = React.createElement('div', { className: 'guide-section snap' },
            React.createElement('div', { className: 'intro-content' }, [
                React.createElement('h1', { key: 'title' }, GUIDE_STEPS.intro.title),
                React.createElement('p', { key: 'subtitle' }, GUIDE_STEPS.intro.subtitle),
                React.createElement('div', { key: 'badges', className: 'time-indicator' },
                    GUIDE_STEPS.intro.badges.map((badge, index) =>
                        React.createElement('span', {
                            key: index,
                            className: 'time-badge'
                        }, badge)
                    )
                ),
                React.createElement('button', {
                    key: 'start-button',
                    className: 'guide-button',
                    onClick: () => setCurrentStep('focus')
                }, 'Begin Your Journey')
            ])
        );
        return container;
    }

    // Create elements for our question sections
    function createQuestionSection(stepKey) {
        const step = GUIDE_STEPS[stepKey];
        return React.createElement('div', { className: 'guide-section snap' },
            React.createElement('div', { className: 'question-content' }, [
                React.createElement('h2', { key: 'question' }, step.question),
                React.createElement('div', { key: 'options', className: 'options-grid' },
                    step.options.map((option, index) =>
                        React.createElement('button', {
                            key: index,
                            className: 'option-button',
                            onClick: () => handleSelection(stepKey, option.value)
                        }, [
                            React.createElement('span', { key: 'emoji', className: 'option-emoji' }, option.emoji),
                            React.createElement('span', { key: 'text', className: 'option-text' }, option.text),
                            React.createElement('span', { key: 'desc', className: 'option-description' }, option.description)
                        ])
                    )
                )
            ])
        );
    }

    // Handle user selections and guide progression
    function handleSelection(step, value) {
        setPreferences(prev => ({
            ...prev,
            [step]: value
        }));

        // Define the progression of steps
        const stepOrder = ['focus', 'intensity', 'duration', 'aromatherapy', 'results'];
        const currentIndex = stepOrder.indexOf(step);
        
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
        } else {
            setCurrentStep('results');
        }
    }

    // Create our results section
    function createResultsSection() {
        // This is where we'll add the recommendation logic
        return React.createElement('div', { className: 'guide-section snap results' },
            React.createElement('div', { className: 'results-content' }, [
                React.createElement('h2', { key: 'title' }, 'Your Perfect Massage'),
                React.createElement('a', {
                    key: 'book',
                    href: 'index.html#two',
                    className: 'book-button'
                }, 'Book Your Massage')
            ])
        );
    }

    // Main render logic
    return React.createElement('div', { className: 'massage-guide-container' },
        currentStep === 'intro' ? createIntroSection() :
        currentStep === 'results' ? createResultsSection() :
        createQuestionSection(currentStep)
    );
}

// Mount our component when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('massage-guide-root');
    ReactDOM.createRoot(container).render(React.createElement(MassageGuide));
});