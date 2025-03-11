from dataclasses import dataclass
from typing import Dict, Any, List, Optional, Union

@dataclass
class DataSource:
    """Data source information needed for SQL generation and chart configuration."""
    name: str
    description: str
    schema: Dict[str, Any]  # Table schema information
    example_data: List[Dict[str, Any]]  # Sample data for context
    special_fields: Optional[Dict[str, Any]] = None  # Any special fields or constraints


