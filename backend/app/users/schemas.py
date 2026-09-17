from pydantic import BaseModel, Field


class UsageEventRequest(BaseModel):
    # Deliberately just a free-form event name, not a Literal: usage_events
    # is for analytics, the set of event types is expected to grow, and a
    # narrower type here would need a migration-adjacent code change for
    # every new one. Never accept Instagram export/relationship data here.
    event_type: str = Field(min_length=1, max_length=100)
