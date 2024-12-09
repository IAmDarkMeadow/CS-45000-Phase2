import { MetricCalculator } from './MetricCalculator';

interface RampUpData {
    readmeContent: string;
}

export class RampUpCalculator extends MetricCalculator {
    protected data: RampUpData;

    constructor(data: any) {
        super(data);

        // Handle cases where data is a string
        if (typeof data === 'string') {
            this.data = { readmeContent: data };
        } else if (data?.readmeContent) {
            this.data = data;
        } else {
            this.data = { readmeContent: '' };
        }
    }

    calculate(): number {
        if (!this.validateData()) {
            return 0;
        }

        const { readmeContent } = this.data;

        // Analyze the README content
        const score = this.analyzeReadme(readmeContent);

        // Ensure the score is between 0 and 1
        return Number(Math.min(Math.max(score, 0), 1).toFixed(2));
    }

    private analyzeReadme(content: string): number {
        // Check for the presence of key sections
        const sections = [
            'installation',
            'getting started',
            'usage',
            'contributing',
            'examples',
            'tutorial',
            'quick start',
            'documentation',
            'how to use',
            'introduction',
            'license' // Added 'license' section
          ];
          
        const contentLower = content.toLowerCase();

        let sectionScore = 0;
        sections.forEach((section) => {
            if (contentLower.includes(section)) {
                sectionScore += 1;
            }
        });

        const sectionScoreRatio = sectionScore / sections.length;

        // Calculate readability score
        const readabilityScore = this.calculateReadability(content);

        // Combine section presence and readability
        const finalScore = (sectionScoreRatio * 0.6) + (readabilityScore * 0.4);

        return finalScore;
    }

    private calculateReadability(text: string): number {
        const sentences = text.match(/[^.!?]+[.!?]+/g)?.length || 1;
        const words = text.match(/\b\w+\b/g)?.length || 1;
        const syllables = this.countSyllables(text);

        const wordsPerSentence = words / sentences;
        const syllablesPerWord = syllables / words;

        // Flesch Reading Ease formula
        const fleschScore = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);

        // Cap the Flesch score between 0 and 100
        const cappedFleschScore = Math.max(Math.min(fleschScore, 100), 0);

        // Normalize the score between 0 and 1
        const normalizedScore = cappedFleschScore / 100;

        return normalizedScore;
    }

    private countSyllables(text: string): number {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        let syllableCount = 0;

        words.forEach((word) => {
            syllableCount += this.countSyllablesInWord(word);
        });

        return syllableCount;
    }

    private countSyllablesInWord(word: string): number {
        word = word.toLowerCase();
        if (word.length <= 3) {
            return 1;
        }
        const vowels = 'aeiouy';
        let syllables = 0;
        let previousIsVowel = false;

        for (let i = 0; i < word.length; i++) {
            const isVowel = vowels.includes(word[i]);
            if (isVowel && !previousIsVowel) {
                syllables++;
            }
            previousIsVowel = isVowel;
        }

        // Adjustments
        if (word.endsWith('e')) {
            syllables--;
        }
        if (syllables === 0) {
            syllables = 1;
        }

        return syllables;
    }

    override validateData(): boolean {
        return (
            super.validateData() &&
            typeof this.data.readmeContent === 'string' &&
            this.data.readmeContent.trim().length > 0 &&
            this.data.readmeContent.trim() !== 'No README file found.'
        );
    }    
}