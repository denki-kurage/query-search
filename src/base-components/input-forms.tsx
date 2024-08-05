import {
	TextControl,
	__experimentalNumberControl as NumberControl,
	CheckboxControl,
	SelectControl,
	Button,
	ButtonGroup,
	DateTimePicker,
	Modal
} from "@wordpress/components";
import { useState, useMemo, createContext, useContext } from '@wordpress/element';

import React, {  }  from "react";
import { usePropertyContext } from "./input-forms-property-context";
import { ModalOpenButton } from "./buttons-extensions";
import { OpenCloseProvider } from "./buttons";
import { Select } from "@mui/material";


type Components = ReturnType<typeof createInputFormComponents>;
const InputComponentsContext = createContext<Components>(null as any);
export const { Provider: InputComponentsContextProvider } = InputComponentsContext;
export const useInputFormContext = () => useContext(InputComponentsContext);


export const safeNaN = (value, x = 0) =>
{
	return Number.isNaN(value) ? x : value;
}

export const toInt = (value, x = 0) =>
{
	return safeNaN(parseInt(value), x);
}

export const toFloat = (value, x = 0.0) =>
{
	return safeNaN(parseFloat(value), x);
}

export interface IPropertiesSetterService
{
	properties: any;
	setProperty: (name: string, value: any) => void;
}

export interface ComponentProps<T>
{
	name: string;
	label?: string;
	onChanged?: (name: string, value: T) => void;
}
export interface SelectComponentProps<T> extends ComponentProps<T>
{
	options: ({value: string, label: string})[];
	message?: string;
}
export interface DateTimeComponentProps<T> extends ComponentProps<T>
{
	//isOpened: boolean;
}

export interface ObjectComponentProps<T> extends ComponentProps<T>
{
	arg: any;
}

const onChangeWrapper = (callbacks: ((name: string, value: any) => void)[]) => (name: string, value: any) =>
{
	for(const callback of callbacks)
	{
		callback?.(name, value);
	}
}
export const createInputFormComponents = () =>
{
	return ({
		Text: ({name, label, onChanged}: ComponentProps<string>) =>
		{
			const { properties, setProperty } = usePropertyContext();
			const wrapper = onChangeWrapper([setProperty, onChanged]);
			const pv = properties?.[name] ?? '';
			return <TextControl label={label} value={pv} onChange={v => wrapper(name, v)} />
		},
		Number: ({name, label=name, onChanged}: ComponentProps<number>) =>
		{
			const { properties, setProperty } = usePropertyContext();
			const wrapper = onChangeWrapper([setProperty, onChanged]);
			const pv = '' + properties[name]
			const [value, setValue] = useState(pv);
			
			return (<>
				<div>{pv}</div>
				<TextControl label={label} value={value} onChange={v => { setValue(v); wrapper(name, toFloat(v)) }} />
			</>)
		},
		Boolean: ({name, label=name, onChanged}: ComponentProps<boolean>) =>
		{
			const { properties, setProperty } = usePropertyContext();
			const wrapper = onChangeWrapper([setProperty, onChanged]);
			const pv = properties[name] ?? false;
			return <CheckboxControl label={label} value={pv} checked={pv} onChange={v => wrapper(name, v)} />
		},
		DateTime: ({name, label=name, onChanged}: DateTimeComponentProps<string>) =>
		{
			const { properties, setProperty } = usePropertyContext();
			const wrapper = onChangeWrapper([setProperty, onChanged]);
			const pv = properties[name] ?? '';
			return (
				<ModalOpenButton label={pv}>
					<DateTimePicker
						currentDate={pv}
						onChange={v => wrapper(name, v)}
						/>
				</ModalOpenButton>

			)
		},
		ArrayList: ({name, label=name, onChanged}: ComponentProps<string|number>) =>
		{
			const { properties, setProperty } = usePropertyContext();
			const wrapper = onChangeWrapper([setProperty, onChanged]);
			const options = properties[name] ?? [];
			return <ModalArrayEditor label={label} options={options} onChange={v => wrapper(name, v)} />

		},
		List: ({name, label=name, onChanged}: ComponentProps<string>) =>
		{
			const { properties, setProperty } = usePropertyContext();
			const wrapper = onChangeWrapper([setProperty, onChanged]);
			const options = properties[name] ?? [];
			return <ModalKeyValueEditor label={label} options={options} onChange={v => wrapper(name, v)} />
		},
		Select: ({name, label=name, onChanged, options, message="次の中から選んでください。"}: SelectComponentProps<string>) =>
		{
			const newOptions = [{label: message, value: ''}, ...options];
			const { properties, setProperty } = usePropertyContext();
			const wrapper = onChangeWrapper([setProperty, onChanged]);

			return <SelectControl
						label={label}
						value={properties[name]}
						options={newOptions}
						onChange={v => wrapper(name, v)}
						/>
		},
		EndpointEdit: ({name, label=name, onChanged, arg}: ObjectComponentProps<any>) =>
		{
			const { properties, setProperty } = usePropertyContext();
			const wrapper = onChangeWrapper([setProperty, onChanged]);
			const pv = properties[name] ?? false;
			return <EndpointArgsEditor
						label={label}
						arg={arg}
						value={pv}
						onChange={v => wrapper(name, v)} />
		}
	})
}



const ModalArrayEditor = ({ options, onChange, label }) =>
{
	return (
		<div className="modal-key-value-editor-container">
			
			<label>{label.toUpperCase()}</label>

			<ModalOpenButton label="リストを編集">
				<KeyValueEditor options={options} onChange={onChange} label={label} isSync={true} />
			</ModalOpenButton>


			{ options.length && (
				<table className="table table-striped modal-key-value-editor">
					<thead>
						<tr>
							<th>値</th>
						</tr>
					</thead>
					<tbody>
						{ options.map((o, i) => <tr key={i}><td>{o.value}</td></tr> )}
					</tbody>
				</table>
			)}

		</div>
	)
}

const ModalKeyValueEditor = ({ options, onChange, label }) =>
{
	return (
		<div className="modal-key-value-editor-container">
			
			<label>{label.toUpperCase()}</label>

			<ModalOpenButton label="リストを編集">
				<KeyValueEditor options={options} onChange={onChange} label={label} isSync={false} />
			</ModalOpenButton>


			{ options.length && (
				<table className="table table-striped modal-key-value-editor">
					<thead>
						<tr>
							<th>値</th>
							<th>ラベル</th>
						</tr>
					</thead>
					<tbody>
						{ options.map((o, i) => <tr key={i}><td>{o.value}</td><td>{o.label}</td></tr> )}
					</tbody>
				</table>
			)}

		</div>
	)
}

interface KeyValueEditorProps
{
	label: string;
	options: ({value: string, label: string})[];
	isSync: boolean;
	onChange: (options: ({value: string, label: string})[]) => void;
}

const KeyValueEditor = ({ options, onChange, label: label2, isSync = false }: KeyValueEditorProps) =>
{
	const [value, setValue] = useState('');
	const [label, setLabel] = useState('');

	const setValueSync = value =>
	{
		setValue(value);
		if(isSync) setLabel(value);
	}

	const setLabelSync = label =>
	{
		setLabel(label);
		if(isSync) setValue(label);
	}

	const add = () =>
	{
		const option = { value, label }
		onChange([...options, option]);
	}

	const change = (option, index) =>
	{
		const items = options.map((o, i) => i === index ? option : o);
		onChange(items);
	}
	
	const canMove = (newIndex) =>
	{
		return newIndex >= 0 && newIndex < options.length;
	}

	const indexMove = (index, mp) =>
	{
		const newIndex = index + mp;
		if(canMove(newIndex))
		{
			const p = options[index];
			const n = options[newIndex];
			options[index] = n;
			options[newIndex] = p;
			onChange([...options]);
		}
	}

	const remove = (index) =>
	{
		options.splice(index, 1);
		onChange([...options]);
	}

	return (
		<>
			<label>{label2}</label>
			<table className="key-value-editor">
				<thead>
					<tr>
						<th className="key-value-editor-th-value">値</th>
						{ !isSync && <th className="key-value-editor-th-label">ラベル</th> }
						<th className="key-value-editor-th-command">コマンド</th>
					</tr>				
				</thead>

				<tbody>
					<tr>
						<td><TextControl value={value} onChange={setValueSync} /></td>
						{ !isSync && <td><TextControl value={label} onChange={setLabelSync} /></td> }
						<td><ButtonGroup style={{width: '100%'}}><Button variant="primary" onClick={add} className="key-value-editor-add">追加</Button></ButtonGroup></td>
					</tr>
					{
						options.map((o, i) => (
							<KeyValueInput
								key={i}
								isSync={isSync}
								index={i}
								option={o}
								onChange={o => change(o, i)}
								onIndexMove={p => indexMove(i, p)}
								canMove={canMove}
								onRemove={() => remove(i)}
								/>
						))
					}				
				</tbody>

			</table>
		</>
	)
}

const KeyValueInput = ({ index, isSync, option, onChange, onIndexMove, canMove, onRemove }) =>
{
	const { value, label } = option;

	return (
		<tr>
			<td>
				<TextControl value={value} onChange={value => onChange({value, label})}  />
			</td>
			{ !isSync &&
				<td>
					<TextControl value={label} onChange={label => onChange({value, label})} />
				</td>
			}
			<td>
				<ButtonGroup>
					<Button variant="primary" onClick={() => onIndexMove(-1)} disabled={!canMove(index - 1)}>(↑)上</Button>
					<Button variant="primary" onClick={() => onIndexMove(1)} disabled={!canMove(index + 1)}>下(↓)</Button>
					<Button variant="primary" onClick={onRemove}>削除</Button>
				</ButtonGroup>
			</td>
		</tr>
	)
}


export const EndpointArgsEditor = ({ arg, label, value, onChange }) =>
{

	const ed = resolveObjectEdit(arg);
	const c = Array.isArray(ed) ? ed : [ed, {}];

	// @ts-ignore
	const [ Component, props ] = c;

	console.log(Component)
	if(arg.type === 'integer')
	{
		// @ts-ignore
		return <Component name={field} {...props} />
	}
	return <div>{arg.type}</div>;

	// @ts-ignore
	return <Component {...props} />
}

export const resolveObjectEdit = (arg) =>
{
	const { type, format, enum: stringEnum, items } = arg;
	const { Text, Number, Boolean, DateTime, Select, ArrayList } = useInputFormContext();

	if(type === 'string')
	{
		if(format === 'date-time')
		{
			return DateTime;
		}

		if(!! stringEnum)
		{
			const options = stringEnum.map(e => ({value: e, label: e}));
			return [Select, { options }];
		}
		
		return Text;
	}
	
	if(type === 'array')
	{
		const { type: itemsType } = items ?? { type: 'integer' };
		return [ArrayList, { type: itemsType }];
	}

	if(type === 'object')
	{

		return ObjectEditor;
	}

	switch(type)
	{
		case 'integer':
			return Number;
		case 'boolean':
			return Boolean;	
	}

	return () => <p>xxx</p>;

}
	
	
	