import random

templates = [
    "A {faction} in {location} needs help recovering {object} stolen by {enemy}.",
    "Two {factions} are on the brink of war over {resource}; the heroes must decide which side to support.",
    "The {enemy} who terrorized {location} is actually {unexpected_role}, hiding their true goal of {secret_plot}."
]

factions = ["thieves’ guild", "order of paladins", "village militia", "necromancer cabal"]
locations = ["ancient forest", "desert caravan route", "mountain pass", "flooded catacombs"]
objects = ["lost crown", "forbidden grimoire", "map to the underworld", "enchanted blade"]
enemies = ["bandit king", "demon hound", "rogue knight", "rival adventurers"]
resources = ["sacred spring", "vein of mithril", "trade route", "arcane leyline"]
unexpected_roles = ["a cursed child", "the mayor’s advisor", "a disguised angel", "the last dragon"]
secret_plots = ["summoning a forgotten god", "usurping the local ruler", "breaking an ancient seal", "plunging the land into eternal night"]

def generate_hook():
    template = random.choice(templates)
    return template.format(
        faction=random.choice(factions),
        factions=f"{random.choice(factions)} and {random.choice(factions)}",
        location=random.choice(locations),
        object=random.choice(objects),
        enemy=random.choice(enemies),
        resource=random.choice(resources),
        unexpected_role=random.choice(unexpected_roles),
        secret_plot=random.choice(secret_plots)
    )

for _ in range(5):
    print(generate_hook())
