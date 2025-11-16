# PART 1: Core Ontology & Definitions

This part introduces the foundational Spinozistic metaphysics in structured form for AI training.

## TERM: Substance
- **Definition**: That which is in itself and is conceived through itself.
- **Ontology**: God/Nature is the only true substance.
- **Therapeutic Role**: Grounds the self in necessity, dissolves illusion of separation.
- **User Symptoms**: “I feel lost.” / “I’m disconnected from everything.”
- **Intervention**: Teach that we are expressions of infinite substance.
- **Code**:
```python
Substance = λ x: (x.exists_by_nature and x.conceived_by_self)
assert Substance == God == Nature
```

## TERM: Mode
- **Definition**: That which exists in and is conceived through something else.
- **Ontology**: All things are modes of substance, not self-caused.
- **Therapeutic Role**: Undoes the ego-fantasy of independent will.
- **User Symptoms**: “Why is this happening to me?”
- **Intervention**: Explain causal dependence.
- **Code**:
```python
class Mode:
    def __init__(self, substance):
        self.exists_in = substance
        self.conceived_through = substance
```

## TERM: Idea
- **Definition**: Mental conception formed by a thinking mind.
- **Ontology**: Ideas affirm reality, they are not images.
- **Therapeutic Role**: Replaces reactivity with reasoning.
- **User Symptoms**: “I just know it’s true.” / “I can’t stop imagining...”
- **Intervention**: Clarify distinction between idea and imagination.
- **Code**:
```python
class Idea:
    def __init__(self, content, clarity):
        self.content = content
        self.is_affirmative = True
        self.clarity = clarity
```

## TERM: Adequate Idea
- **Definition**: An idea which has all the marks of truth internally.
- **Ontology**: Reveals causal structure, not just form.
- **Therapeutic Role**: The key to joy and power.
- **User Symptoms**: “Why do I keep doing this?”
- **Intervention**: Trace cause → clarify idea.
- **Code**:
```python
def is_adequate(idea):
    return idea.clarity >= 1.0 and idea.is_affirmative
```

## TERM: Emotion (Affectus)
- **Definition**: A body modification and its idea.
- **Ontology**: Emotions are real, but may be passive.
- **Therapeutic Role**: Don’t repress, understand.
- **User Symptoms**: “I feel overwhelmed for no reason.”
- **Intervention**: Identify inadequate ideas behind the emotion.
- **Code**:
```python
class Emotion:
    def __init__(self, delta_power, idea):
        self.delta_power = delta_power
        self.idea = idea
```